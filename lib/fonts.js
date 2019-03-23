'use babel'

import {applyFont, triggerMeasurements, addFixerElement} from './utils'
import {FontsSelector} from './fonts-selector'

let disposables = null

export function activate() {
  // migrate config
  if(atom.config.get('fonts.fontFamily') === '3270') {
    atom.config.set('fonts.fontFamily', 'IBM 3270')
  }
  const { CompositeDisposable } = require('atom')
  disposables = new CompositeDisposable()

  disposables.add(
    // NOTE: applyFont always returns functionally the same disposable, so
    // we're only using it once
    applyFont(atom.config.get('fonts.fontFamily')),
    // apply fonts when config changes
    atom.config.onDidChange('fonts.fontFamily', function({newValue}) {
      applyFont(newValue)
    }),
    atom.config.onDidChange('fonts.secondaryFonts', function() {
      applyFont(atom.config.get('fonts.fontFamily'))
    }),
    // command to show fonts selector
    atom.commands.add('atom-workspace', 'fonts:open-font-selector', function() {
      atom.workspace.open(new FontsSelector(), {split: 'right'})
    })
  )

  // give chromium some time to load the fonts
  // then trigger measurements
  setTimeout(triggerMeasurements, 500)

  if (document.querySelector('fonts-fixer') === null) {
    disposables.add(addFixerElement())
  }
}

export function deactivate() {
  if (disposables) disposables.dispose()
  disposables = null
}
