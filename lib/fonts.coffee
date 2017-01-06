module.exports =
  activate: ->
    Runner = require './runner'
    Runner.run()

  deactivate: ->
    Runner = require './runner'
    Runner.stop()
