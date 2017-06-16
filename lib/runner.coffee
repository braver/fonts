module.exports =
  run: () ->
    body = document.querySelector('body')

    triggerMeasurements = (force) ->
      atom.workspace.increaseFontSize()
      atom.workspace.decreaseFontSize()

    applyFont = () ->
      font =
        "'" +
        atom.config.get('fonts.fontFamily') +
        "', " +
        atom.config.get('fonts.secondaryFonts')

      body.setAttribute('style', '--fonts-package-editorfont: ' + font + ';')
      triggerMeasurements()

    # apply fonts when atom is ready
    applyFont()

    # apply fonts when config changes
    # after config changes measurements are already triggered by atom
    @observer = atom.config.observe 'fonts.fontFamily', ->
      applyFont()
    @observer = atom.config.observe 'fonts.secondaryFonts', ->
      applyFont()

    # give chromium some time to load the fonts
    # then trigger measurements
    setTimeout (->
      triggerMeasurements()
    ), 500

    if document.getElementsByTagName('fonts-fixer').length is 0
      # create a fixer element that forces chrome to load font styles
      # contains *r*egular, *b*old, *i*talic and i in b
      fixerProto = Object.create(HTMLElement::)
      fixerProto.createdCallback = ->
        @innerHTML = "regular<b>bold<i>italic</i></b><i>italic</i>"
        return

      fixer = document.registerElement("fonts-fixer",
        prototype: fixerProto
      )

      atom.views.getView(atom.workspace).appendChild(new fixer())

  stop: ->
    body = document.querySelector('body')
    body.removeAttribute('fonts-editor-font')

    @observer?.dispose()
