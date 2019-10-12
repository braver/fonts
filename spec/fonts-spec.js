'use babel'

import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'
import { join } from 'path'
import { walkFonts, handleFontsDefinition, addFontByDesc } from '../scripts/lib'

const doc = safeLoad(
  readFileSync(join(__dirname, '..', 'scripts', 'fonts.yaml'), 'utf8')
)
const resourceDir = join(__dirname, '..', 'resources')
const fontSize = '40px'
// all printable ASCII symbols except excludedChars
const excludedChars = '^`~' // the first two missing in Lekton, the last one's missing in League
const testString = Array(127 - 32)
  .fill(null)
  .map((_, i) => String.fromCharCode(32 + i))
  .filter(x => !excludedChars.includes(x))
  .join('')

/**
 * @param {string} fontName
 * @param {string} fallback
 * @param {string} fontStyle
 * @returns {Promise<[Uint8ClampedArray, HTMLCanvasElement]>}
 */
async function getFontImage(fontName, fallback, fontStyle) {
  const body = document.body
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to create canvas')
  body.appendChild(canvas)
  canvas.width = 8000
  canvas.height = 60
  ctx.textAlign = 'start'
  ctx.textBaseline = 'bottom'
  let fontSpecStyle
  switch (fontStyle) {
    case 'normal':
      fontSpecStyle = 'normal normal'
      break
    case 'bold':
      fontSpecStyle = 'normal bold'
      break
    case 'italic':
      fontSpecStyle = 'italic normal'
      break
    case 'bold-italic':
      fontSpecStyle = 'italic bold'
      break
    case '':
      fontSpecStyle = ''
      break
    default:
      throw new Error(`Unknown font style ${fontStyle}`)
  }
  const fontSpec = `${fontSpecStyle} ${fontSize} "${fontName}", ${fallback}`
  // @ts-ignore
  await document.fonts.load(fontSpec)
  ctx.font = fontSpec
  ctx.fillStyle = '#ffffff'
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillText(testString, 10, 50)
  const idata = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = idata.data
  return [data, canvas]
}

/**
 * @param {string} fontName
 * @param {string} fontPath
 * @param {string} fontStyle
 */
async function compareFonts(fontName, fontPath, fontStyle) {
  const tempFontName = 'Temp Font'
  const fontBuf = readFileSync(join(resourceDir, ...fontPath.split('/')))
  // @ts-ignore
  const f = new FontFace(tempFontName, fontBuf)
  await f.load()
  // @ts-ignore
  document.fonts.add(f)

  const [nameIm, nic] = await getFontImage(fontName, 'monospace', fontStyle)
  const [fileIm, fic] = await getFontImage(tempFontName, 'monospace', '')

  // @ts-ignore
  document.fonts.delete(f)

  nic.remove()
  fic.remove()

  for (var j = 0; j < nameIm.length; j++) {
    if (nameIm[j] !== fileIm[j]) {
      return false
    }
  }

  return true
}

describe('Fonts from resources/ are distinct from fallback serif (i.e. they load)', function() {
  beforeEach(function() {
    let pkg
    waitsForPromise(
      async () => (pkg = await atom.packages.activatePackage('fonts'))
    )
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => pkg.stylesheetsActivated)
  })

  /**
   * @param {any} font
   * @param {string} style
   * @param {string} file
   */
  function* testFont(font, style, file) {
    let result
    it(`Loads ${font} with ${style} from ${file}`, function() {
      waitsForPromise(async function() {
        result = await compareFonts('serif', file, style)
      })
      runs(function() {
        expect(result).toBe(false)
      })
    })
  }

  Array.from(
    walkFonts(
      handleFontsDefinition.bind(null, addFontByDesc.bind(null, testFont)),
      doc,
      {},
      null
    )
  )
})

describe('Font rendering', function() {
  beforeEach(function() {
    let pkg
    waitsForPromise(
      async () => (pkg = await atom.packages.activatePackage('fonts'))
    )
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => pkg.stylesheetsActivated)
  })

  /**
   * @param {string} font
   * @param {string} style
   * @param {string} file
   */
  function* testFont(font, style, file) {
    let result
    it(`matches between named '${font}' with style '${style}' and file '${file}'`, function() {
      waitsForPromise(async function() {
        result = await compareFonts(font, file, style)
      })
      runs(function() {
        expect(result).toBe(true)
      })
    })
  }

  Array.from(
    walkFonts(
      handleFontsDefinition.bind(null, addFontByDesc.bind(null, testFont)),
      doc,
      {},
      null
    )
  )
})

describe('Computed TextEditor font family', function() {
  let editor
  beforeEach(function() {
    let pkg
    waitsForPromise(async () => (editor = await atom.workspace.open()))
    runs(() => editor.setText(testString))
    waitsForPromise(
      async () => (pkg = await atom.packages.activatePackage('fonts'))
    )
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => pkg.stylesheetsActivated)
    runs(() => {
      document.body.appendChild(atom.views.getView(atom.workspace))
    })
  })
  afterEach(function() {
    runs(() => {
      atom.views.getView(atom.workspace).remove()
    })
  })

  const fontVariantsSet = new Set(
    walkFonts(
      handleFontsDefinition.bind(null, function*(/** @type {string} */ font) {
        yield font
      }),
      doc,
      {},
      null
    )
  )

  for (const font of fontVariantsSet.values()) {
    it(`matches ${font} when set in config`, function() {
      let editorFontName
      atom.config.set('fonts.fontFamily', font)
      editorFontName = getComputedStyle(atom.views.getView(editor))
        .fontFamily.split(',')[0]
        .trim()
        .replace(/"/g, '')
      expect(editorFontName).toBe(font)
    })
  }
})
