'use babel'

import {applyFont} from './utils'

export class FontsSelector {
  constructor() {
    const sel = document.createElement('select')
    sel.multiple = true
    sel.style.width = '100%'
    sel.style.overflow = "auto"
    sel.style.background = "inherit"
    sel.style.border = "none"
    sel.style.padding = "1em"
    sel.classList.add('native-key-bindings')
    sel.addEventListener('change', this._onChange.bind(this))
    for(const fontFace of atom.config.schema.properties.fonts.properties.fontFamily.enum) {
      const opt = document.createElement('option')
      opt.value = fontFace
      opt.innerText = fontFace
      opt.style.fontFamily = `"${fontFace}"`
      opt.style.fontSize = `${atom.config.get('editor.fontSize')}px`
      opt.style.height = `${1.5*atom.config.get('editor.fontSize')}px`
      if(atom.config.get('fonts.fontFamily') === fontFace){
        opt.selected = true
      }
      sel.appendChild(opt)
    }
    this.element = sel
  }
  getTitle() {
    return 'Fonts Selector'
  }
  destroy() {
    if(this.fontFamily) atom.config.set('fonts.fontFamily', this.fontFamily)
  }
  _onChange(ev) {
    if (ev.target && ev.target.value) {
      this.fontFamily = ev.target.value
      applyFont(this.fontFamily)
    }
  }
}
