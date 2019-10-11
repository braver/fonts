const yaml  = require('js-yaml')
const fs    = require('fs')
const npath = require('path')
const lib   = require('./lib')

const rootPath = 'atom://fonts/resources'

const types = {
  'bold-italic': ['bold', 'italic'],
  'bold': ['bold', 'normal'],
  'italic': ['normal', 'italic'],
  'normal': ['normal', 'normal'],
}

function fontFace(font, type, path) {
  if (!types[type]) throw new Error(`Unknown type for ${font}: ${type}`)
  const [weight, style] = types[type]
  return `.font ( '${font}', ${weight}, ${style}, '${path}' );`;
}

function cmp1(a, b) {
  return a.localeCompare(b, 'en', {
    sensitivity: 'base',
    ignorePunctuation: true,
  })
}

const revtypedict = {
  'normalnormal': 'normal',
  'boldnormal': 'bold',
  'normalitalic': 'italic',
  'bolditalic': 'bold-italic',
}

const fontLessTemplate = `\
.font(@font, @weight, @style, @path) {
  @font-face {
    font-family: @font;
    font-weight: @weight;
    font-style: @style;
    src: url('${rootPath}/@{path}');
  }
}
`

function *addFont(font, type, path) {
  if (!lib.resourceExists(path)) {
    throw new Error(`File ${path} does not exist for ${type} variant of font ${font}`)
  }
  yield fontFace(font, type, path)
}

try {
  const doc = yaml.safeLoad(fs.readFileSync(npath.join('scripts', 'fonts.yaml'), 'utf8'));

  // write styles/fonts.less

  const fontsless = Array.from(lib.walkFonts(
    lib.handleFontsDefinition.bind(this, lib.addFontByDesc.bind(this, addFont)),
    doc, {}, null
  ))

  fs.writeFileSync(
    npath.join('styles', 'fonts.less'),
    fontLessTemplate+'\n'+fontsless.join('\n')+'\n',
    'utf8',
  )

  // write package.json
  const fontVariantsSet = new Set(lib.walkFonts(
    lib.handleFontsDefinition.bind(this, function*(font) { yield font }),
    doc, {}, null
  ))
  const packagejson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  packagejson.configSchema.fontFamily.enum = Array.from(fontVariantsSet)
  fs.writeFileSync('package.json', JSON.stringify(packagejson, null, 2)+'\n', 'utf8')

  // write README.md
  const fontNamesSet = new Set(Object.keys(doc).filter(x => !x.startsWith('x-')))
  const allfonts = Array.from(fontNamesSet).sort(cmp1)
  const readme = fs.readFileSync('README.md', 'utf8')
  const newreadme = readme.replace(
    /<!-- BEGIN FONTS -->[^]*<!-- END FONTS -->/,
    `<!-- BEGIN FONTS -->\n${allfonts.join(', ')}\n<!-- END FONTS -->`
  ).replace(
    /<!-- BEGIN NUM_FONTS -->[0-9]+<!-- END NUM_FONTS -->/,
    `<!-- BEGIN NUM_FONTS -->${allfonts.length}<!-- END NUM_FONTS -->`,
  ).replace(
    /<!-- BEGIN NUM_VARIANTS -->[0-9]+<!-- END NUM_VARIANTS -->/,
    `<!-- BEGIN NUM_VARIANTS -->${fontVariantsSet.size}<!-- END NUM_VARIANTS -->`,
  )
  fs.writeFileSync('README.md', newreadme, 'utf8')
} catch (e) {
  console.log(e);
}
