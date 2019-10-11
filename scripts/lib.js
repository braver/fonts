const npath = require('path')
const fs    = require('fs')

const types = [
  'normal',
  'italic',
  'bold',
  'bold-italic',
]

function cmp1(a, b) {
  return a.localeCompare(b, 'en', {
    sensitivity: 'base',
    ignorePunctuation: true,
  })
}

function cmp(a, b) {
  return cmp1(a[0], b[0])
}

function constructFullFontName(inheritedName, key) {
  if (key === '*') return inheritedName
  if (!inheritedName) return key
  return `${inheritedName} ${key}`
}

function checkLongForm(font, conf, defaultStyle) {
  if (Object.keys(conf).length === 1 && Object.keys(conf)[0] === defaultStyle) {
    console.warn(`Found long form ${defaultStyle}-only font definition: ${font}`)
  }
}

function strToObj(strOrObj, propName = 'normal') {
  return typeof strOrObj === 'string' ? { [propName]: strOrObj } : strOrObj;
}

function *walkFonts(f, doc, inheritedProps, inheritedName) {
  for(const [k, v] of Object.entries(doc).sort(cmp)) {
    if (k.startsWith('x-')) continue
    const font = constructFullFontName(inheritedName, k)
    checkLongForm(font, v, 'normal')
    const conf = { ...inheritedProps, ...strToObj(v) }
    if (v.variants) {
      const ip = { ...v }
      delete ip.variants
      yield *walkFonts(f, v.variants, ip, font)
    } else {
      yield *f(font, conf)
    }
  }
}

function genTemplateFn(conf, template) {
  if (template == null) return template
  const rx = /\{([a-zA-Z][a-zA-Z0-9-]*)(?:\/([^/]+)\/([^/]*)\/([gimsuy]*))?\}/g
  return function(path) {
    const dict = npath.parse(path)
    return template.replace(rx, function(m, p1, p2, p3, p4) {
      const val = dict[p1] || conf[p1] || ''
      if (p2) return val.replace(new RegExp(p2, p4), p3)
      else return val
    })
  }
}


const resourceDir = npath.join(__dirname, '..', 'resources')
function resourceExists(path) {
  return fs.existsSync(npath.join(resourceDir, ...path.split('/')))
}

function *addFontByDesc(addFont, font, conf, defaultStyle) {
  if (!Object.keys(conf).includes(defaultStyle)) {
    throw new Error(`No ${defaultStyle} variant for: ${font}`)
  }
  for (const type of types) {
    if (conf[type]) yield *addFont(font, type, conf[type])
    else if (conf[type] == null && conf[type+'-template']) {
      const fn = genTemplateFn(conf, conf[type+'-template'])
      const tpath = fn(conf[defaultStyle])
      if(resourceExists(tpath)) yield *addFont(font, type, tpath)
      else console.warn(`${font} specified ${type} template, but computed path ${tpath} does not exist`)
    }
  }
}

function normalToBold(obj) {
  const newObj = {...obj}
  delete newObj.normal
  delete newObj.italic
  delete newObj['italic-template']
  delete newObj['bold-template']
  newObj.bold = obj.normal
  newObj['bold-italic'] = obj.italic
  newObj['bold-italic-template'] = obj['italic-template']
  return newObj
}

function *handleFontsDefinition(handleFontDesc, font, conf) {
  if (conf.weight != null) {
    const {names, step, weight} = conf
    const bold_step = conf.bold
    if (names == null) throw new Error(`Font ${font} specifies weight, but no names`)
    if (step == null) throw new Error(`Font ${font} specifies weight, but no step`)
    if (bold_step == null) throw new Error(`Font ${font} specifies weight, but no bold step`)
    for(const [i, name] of names.entries()) {
      const inhconf = { ...conf }
      delete inhconf.names
      delete inhconf.weight
      delete inhconf.step
      delete inhconf.bold
      const normal = weight[i*step]
      const bold = weight[Math.min(i*step+bold_step, weight.length - 1)]
      const font_name = constructFullFontName(font, name)
      checkLongForm(font_name, normal, 'normal')
      checkLongForm(font_name, bold, 'bold')
      const desc = { ...inhconf, ...strToObj(normal) }
      const desc_bold = normalToBold({...inhconf, ...strToObj(bold)})
      yield *handleFontDesc(font_name, desc, 'normal')
      yield *handleFontDesc(font_name, desc_bold, 'bold')
    }
  } else {
    yield *handleFontDesc(font, conf, 'normal')
  }
}

module.exports = { walkFonts, handleFontsDefinition, addFontByDesc, resourceExists }
