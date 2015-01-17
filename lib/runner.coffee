module.exports =
  run: () ->

    body = document.querySelector('body')
    #editor = atom.workspace.getActiveTextEditor()

    triggerMeasurements = (force) ->
      atom.workspace.increaseFontSize()
      atom.workspace.decreaseFontSize()

    applyFont = (font) ->
      body.setAttribute('fonts-editor-font', font)
      triggerMeasurements()

    # apply fonts when atom is ready
    applyFont(
      atom.config.get('fonts.fontFamily')
    )

    # apply fonts when config changes
    # after config changes measurements are already triggered by atom
    atom.config.observe 'fonts.fontFamily', ->
      applyFont(atom.config.get('fonts.fontFamily'))

    # give chromium some time to load the fonts
    # then trigger measurements
    setTimeout (->
      triggerMeasurements()
    ), 500

    # force chromium to load all font files regardless of editor content
    # this also makes sure fonts are loaded as soon as config changes
    atom.workspaceView.append '<div class="fonts-fixer">
      <span class="regular">r</span>
      <span class="bold">b</span>
      <span class="italic">i</span>
      <span class="bolditalic">bi</span>
    </div>'
