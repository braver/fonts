const npath = require('path')
const fs = require('fs')

const types = ['normal', 'italic', 'bold', 'bold-italic']

/**
 * @param {string} a
 * @param {string} b
 */
function cmp1(a, b) {
  return a.localeCompare(b, 'en', {
    sensitivity: 'base',
    ignorePunctuation: true,
  })
}

/**
 * @param {[string, any]} a
 * @param {[string, any]} b
 */
function cmp(a, b) {
  return cmp1(a[0], b[0])
}

/**
 * @param {string | null | undefined} inheritedName
 * @param {string} key
 */
function constructFullFontName(inheritedName, key) {
  if (!inheritedName) {
    if (key === '*')
      throw new Error("No inherited name, but the font name is '*'")
    else return key
  }
  if (key === '*') return inheritedName
  return `${inheritedName} ${key}`
}

/**
 * @param {string} font
 * @param {Object<string, any>} conf
 * @param {string} defaultStyle
 */
function checkLongForm(font, conf, defaultStyle) {
  if (Object.keys(conf).length === 1 && Object.keys(conf)[0] === defaultStyle) {
    console.warn(
      `Found long form ${defaultStyle}-only font definition: ${font}`
    )
  }
}

/**
 * @param {string | Object<string, any>} strOrObj
 * @param {string} propName
 */
function strToObj(strOrObj, propName = 'normal') {
  return typeof strOrObj === 'string' ? { [propName]: strOrObj } : strOrObj
}

/**
 * @param {{ (arg0: string, arg1: any): IterableIterator; }} f
 * @param {Object<string, any>} doc
 * @param {Object<string, any>} inheritedProps
 * @param {string | null | undefined} inheritedName
 */
function* walkFonts(f, doc, inheritedProps, inheritedName) {
  for (const [k, v] of Object.entries(doc).sort(cmp)) {
    if (k.startsWith('x-')) continue
    const font = constructFullFontName(inheritedName, k)
    checkLongForm(font, v, 'normal')
    const conf = { ...inheritedProps, ...strToObj(v) }
    if (v.variants) {
      const ip = { ...v }
      delete ip.variants
      yield* walkFonts(f, v.variants, ip, font)
    } else {
      yield* f(font, conf)
    }
  }
}

/**
 * @param {Object<string, any>} conf
 * @param {string} template
 * @param {string} path
 */
function runPathTemplate(conf, template, path) {
  return runTemplate(conf, template, npath.parse(path))
}

const templateRx = /\{([a-zA-Z][a-zA-Z0-9-]*)(?:\/([^/]+)\/([^/]*)\/([gimsuy]*))?\}/g
/**
 * @param {Object<string, any>} conf
 * @param {string} template
 */
function runTemplate(conf, template, dict = {}) {
  return template.replace(templateRx, function(_m, p1, p2, p3, p4) {
    const val = dict[p1] || conf[p1] || ''
    if (p2) return val.replace(new RegExp(p2, p4), p3)
    else return val
  })
}

const resourceDir = npath.join(__dirname, '..', 'resources')
/**
 * @param {string} path
 */
function resourceExists(path) {
  return fs.existsSync(npath.join(resourceDir, ...path.split('/')))
}

/**
 * @param {{ (font: string, type: string, path: string): IterableIterator; }} addFont
 * @param {string} font
 * @param {Object<string, any>} conf
 * @param {string} defaultStyle
 */
function* addFontByDesc(addFont, font, conf, defaultStyle) {
  if (!Object.keys(conf).includes(defaultStyle)) {
    throw new Error(`No ${defaultStyle} variant for: ${font}`)
  }
  for (const type of types) {
    if (conf[type]) yield* addFont(font, type, runTemplate(conf, conf[type]))
    else if (conf[type] == null && conf[type + '-template']) {
      const tpath = runPathTemplate(
        conf,
        conf[type + '-template'],
        runTemplate(conf, conf[defaultStyle])
      )
      if (resourceExists(tpath)) yield* addFont(font, type, tpath)
      else
        throw new Error(
          `${font} specified ${type} template, but computed path ${tpath} does not exist`
        )
    }
  }
}

/**
 * @param {Object<string, any>} obj
 */
function normalToBold(obj) {
  const newObj = { ...obj }
  delete newObj.normal
  delete newObj.italic
  delete newObj['italic-template']
  delete newObj['bold-template']
  newObj.bold = obj.normal
  newObj['bold-italic'] = obj.italic
  newObj['bold-italic-template'] = obj['italic-template']
  return newObj
}

/**
 * @param {{ (arg0: any, arg1: any, arg2: string): IterableIterator; }} handleFontDesc
 * @param {string} font
 * @param {{ names?: string[]; step?: number; weight: any[]; bold?: number; }} conf
 * @returns {IterableIterator}
 */
function* handleFontsDefinition(handleFontDesc, font, conf) {
  if (conf.weight != null) {
    const { names, step, weight } = conf
    const bold_step = conf.bold
    if (names == null)
      throw new Error(`Font ${font} specifies weight, but no names`)
    if (step == null)
      throw new Error(`Font ${font} specifies weight, but no step`)
    if (bold_step == null)
      throw new Error(`Font ${font} specifies weight, but no bold step`)
    for (const [i, name] of names.entries()) {
      const inhconf = { ...conf }
      delete inhconf.names
      delete inhconf.weight
      delete inhconf.step
      delete inhconf.bold
      const normal = weight[i * step]
      const bold = weight[Math.min(i * step + bold_step, weight.length - 1)]
      const font_name = constructFullFontName(font, name)
      checkLongForm(font_name, normal, 'normal')
      checkLongForm(font_name, bold, 'bold')
      const desc = { ...inhconf, ...strToObj(normal) }
      const desc_bold = normalToBold({ ...inhconf, ...strToObj(bold) })
      yield* handleFontDesc(font_name, desc, 'normal')
      yield* handleFontDesc(font_name, desc_bold, 'bold')
    }
  } else {
    yield* handleFontDesc(font, conf, 'normal')
  }
}

module.exports = {
  walkFonts,
  handleFontsDefinition,
  addFontByDesc,
  resourceExists,
}
