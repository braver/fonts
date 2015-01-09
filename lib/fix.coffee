module.exports =
  run: () ->

    updates = 0

    triggerMeasurements = () ->
      console.log(updates)
      if updates <= 5 #do this a bunch of times and then stop
        atom.workspaceView.increaseFontSize()
        atom.workspaceView.decreaseFontSize()

    #trigger every time tabs are switched or a new editor is opened
    atom.workspace.observeActivePaneItem ->
      triggerMeasurements()

    #this triggers all the time something happens in an editor
    atom.workspaceView.on('editor:display-updated', ->
      triggerMeasurements()
      if updates <= 5
        updates = updates + 1
    )

    #reset when font settings change
    atom.config.onDidChange 'editor.fontFamily', ->
      updates = 0
