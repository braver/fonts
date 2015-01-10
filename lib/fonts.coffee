module.exports =

  config:
    fontFamily:
      description: 'Use one of the fonts available in this package.
        View the README for descriptions of each.'
      type: 'string'
      default: 'Inconsolata'
      enum: [
        'Anka/Coder',
        'Anonymous Pro',
        'Aurulent Sans Mono',
        'Average Mono',
        'Bitstream Vera Sans Mono',
        'BPmono',
        'Consolamono',
        'Cousine',
        'Cutive Mono',
        'DejaVu Mono',
        'Droid Sans Mono',
        'Effects Eighty',
        'Fantasque Sans Mono',
        'Fifteen'
        'Fira Mono',
        'Fixedsys',
        'Generic Mono',
        'GNU Freefont',
        'GNU Unifont',
        'Hermit',
        'Hermit Light',
        'Inconsolata',
        'Inconsolata-g',
        'Latin Modern Mono',
        'Latin Modern Mono Light',
        'Lekton',
        'Liberation Mono',
        'Luxi Mono',
        'Meslo',
        'M+',
        'M+ Light',
        'M+ Medium',
        'M+ Thin',
        'Monofur',
        'NotCourierSans',
        'Nova Mono',
        'Oxygen Mono',
        'Profont',
        'Proggy Clean',
        'PT Mono',
        'Quinze',
        'saxMono',
        'Share Tech Mono',
        'Source Code Pro',
        'Source Code Pro Extra Light',
        'Source Code Pro Light',
        'Source Code Pro Medium',
        'Sudo',
        'TeX Gyre Cursor',
        'Ubuntu Mono',
        'VT323',
        'Verily Serif Mono'
      ]

  activate: (state) ->

    # code in separate file so deferral keeps activation time down
    atom.workspaceView.ready ->
      Runner = require './runner'
      Runner.run()
