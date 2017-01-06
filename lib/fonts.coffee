module.exports =
  activate: (state) ->
    # code in separate file so deferral keeps activation time down
    atom.packages.onDidActivateInitialPackages ->
      Runner = require './runner'
      Runner.run()
