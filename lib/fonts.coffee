module.exports =
  activate: (state) ->

    # code in separate file so deferral keeps activation time down
    atom.workspaceView.ready ->
      Fix = require './fix'
      Fix.run()
