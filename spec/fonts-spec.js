const yaml = require("js-yaml")
const fs = require("fs")
const npath = require("path")

const doc = yaml.safeLoad(
  fs.readFileSync(npath.join(__dirname, "..", "scripts", "fonts.yaml"), "utf8")
)
const resourceDir = npath.join(__dirname, "..", "resources")
const fontSize = '40px'
// all printable ASCII symbols except excludedChars
const excludedChars =
  '^`' // these two are missing in Lekton
  + '~' // this one's missing in League
const testString =
  Array(127-32).fill().map((_, i) => String.fromCharCode(32+i))
  .filter(x => !excludedChars.includes(x))
  .join('')

async function getFontImage(fontName, fallback, fontStyle) {
  const body = document.body
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  body.appendChild(canvas)
  canvas.width = 8000
  canvas.height = 60
  ctx.textAlign = "start"
  ctx.textBaseline = "bottom"
  let fontSpecStyle
  switch (fontStyle) {
    case 'normal': fontSpecStyle = 'normal normal'; break;
    case 'bold': fontSpecStyle = 'normal bold'; break;
    case 'italic': fontSpecStyle = 'italic normal'; break;
    case 'bold-italic': fontSpecStyle = 'italic bold'; break;
    case '': fontSpecStyle = ''; break;
    default: throw new Error(`Unknown font style ${fontStyle}`)
  }
  const fontSpec = `${fontSpecStyle} ${fontSize} "${fontName}", ${fallback}`
  await document.fonts.load(fontSpec)
  ctx.font = fontSpec
  ctx.fillStyle = "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillText(testString, 10, 50)
  const idata = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = idata.data
  return [data, canvas]
}

async function compareFonts(fontName, fontPath, fontStyle) {
  const tempFontName = 'Temp Font'
  const fontBuf = fs.readFileSync(npath.join(resourceDir, ...fontPath.split('/')))
  const f = new FontFace(tempFontName, fontBuf)
  await f.load()
  document.fonts.add(f)

  const [nameIm, nic] = await getFontImage(fontName, 'monospace', fontStyle)
  const [fileIm, fic] = await getFontImage(tempFontName, 'monospace', '')

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

describe("Fonts from resources/ are distinct from fallback serif (i.e. they load)", function() {
  beforeEach(function() {
    let package
    waitsForPromise(async () => package = await atom.packages.activatePackage('fonts'))
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => package.stylesheetsActivated)
  })

  function testFont(file, style) {
    let result
    waitsForPromise(async function() {
      result = await compareFonts('serif', file, style)
    })
    runs(function() {
      expect(result).toBe(false)
    })
  }

  for (const [font, conf] of Object.entries(doc)) {
    if (typeof conf === "string") {
      it(`Font '${font}' with style 'normal' from file '${conf}'`, function() {
        testFont(conf, 'normal')
      })
    } else {
      for (const [type, path] of Object.entries(conf)) {
        it(`Font '${font}' with style '${type}' from file '${path}'`, function() {
          testFont(path, type)
        })
      }
    }
  }
})

describe("Font rendering", function() {
  beforeEach(function() {
    let package
    waitsForPromise(async () => package = await atom.packages.activatePackage('fonts'))
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => package.stylesheetsActivated)
  })

  function testFont(font, file, style) {
    let result
    waitsForPromise(async function() {
      result = await compareFonts(font, file, style)
    })
    runs(function() {
      expect(result).toBe(true)
    })
  }

  for (const [font, conf] of Object.entries(doc)) {
    if (typeof conf === "string") {
      it(`matches between named '${font}' with style 'normal' and file '${conf}'`, function() {
        testFont(font, conf, 'normal')
      })
    } else {
      for (const [type, path] of Object.entries(conf)) {
        it(`matches between named '${font}' with style '${type}' and file '${path}'`, function() {
          testFont(font, path, type)
        })
      }
    }
  }
})

describe("Computed TextEditor font family", function() {
  let editor
  beforeEach(function() {
    let package
    waitsForPromise(async () => editor = await atom.workspace.open())
    runs(() => editor.setText(testString))
    waitsForPromise(async () => package = await atom.packages.activatePackage('fonts'))
    waitsFor(() => atom.packages.isPackageActive('fonts'))
    waitsFor(() => package.stylesheetsActivated)
    runs(() => {
      document.body.appendChild(atom.views.getView(atom.workspace))
    })
  })
  afterEach(function() {
    runs(() => {
      atom.views.getView(atom.workspace).remove()
    })
  })

  for (const font of Object.keys(doc)) {
    it(`it matches ${font} when set in config`, function() {
      let editorFontName
      atom.config.set('fonts.fontFamily', font)
      editorFontName =
        getComputedStyle(atom.views.getView(editor))
          .fontFamily
          .split(',')[0]
          .trim()
          .replace(/"/g, '')
      expect(editorFontName).toBe(font)
    })
  }
})
