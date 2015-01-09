module.exports =
  run: () ->

    updates = 0

    triggerMeasurements = () ->
      if updates <= 5 #do this a bunch of times and then stop
        console.log('jep')
        atom.workspaceView.increaseFontSize()
        atom.workspaceView.decreaseFontSize()

    #trigger every time tabs are switched or a new editor is opened
    atom.workspace.observeActivePaneItem ->
      triggerMeasurements()

    atom.workspaceView.on('editor:display-updated', ->
      triggerMeasurements()
      updates = updates + 1
    )
