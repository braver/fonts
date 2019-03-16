'use babel'

export function triggerMeasurements() {
  atom.workspace.increaseFontSize()
  atom.workspace.decreaseFontSize()
}

export function applyFont(fontFamily) {
  const font = `'${fontFamily}', ${atom.config.get('fonts.secondaryFonts')}`

  // NOTE: since `sourcePath` is specified, there is no need to
  // dispose of fontStylesheetDisposable here, the same style element
  // will be updated, and the newly-returned disposable will be
  // exactly the same functionally as the old one.
  const disp = atom.styles.addStyleSheet(
    `:root { --fonts-package-editorfont: ${font}; }`,
    {
      sourcePath: 'fonts-package-editorfont'
    },
  )

  triggerMeasurements()
  return disp
}

export function addFixerElement() {
  // create a fixer element that forces chrome to load font styles
  // contains *r*egular, *b*old, *i*talic and i in b
  const fixer = document.createElement('fonts-fixer')
  fixer.innerHTML = 'regular<b>bold<i>italic</i></b><i>italic</i>'
  atom.views.getView(atom.workspace).appendChild(fixer)
  const { Disposable } = require('atom')
  return new Disposable(function() {
    fixer.remove()
  })
}
