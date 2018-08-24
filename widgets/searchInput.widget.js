'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid

    this.toggleVisibility = 0
    this.label = this.getLabel()
    this.widget = this.getWidget()
  }

  getLabel () {
    return ''
  }

  renderWidget () {
    return null
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    this.widget.on('keypress', (ch, key) => {
      // console.log(this.widget.content)
      // this.emit('keypress', this.widget.getValue())

      if (key.name === 'escape' || key.name === 'return') {
        this.toggleVisibility = !this.toggleVisibility
        this.widget.clearValue()
        this.widget.destroy()
        this.widgetsRepo.get('containerList').focus()
        // }
      } else {
        this.emit('keypress', this.widget.getValue())
      }
    })

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === '/') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          this.screen.append(this.widget)
          this.screen.render()
          this.widget.focus()
        } else {
          this.screen.remove(this.widget)
        }
      }
    })

    // by default, remove this widget from the screen
    this.screen.remove(this.widget)
  }

  getWidget () {
    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.textarea, {
      focused: false,
      border: 'line',
      style: {
        bg: 'yellow',
        fg: 'black'
      },
      align: 'left',
      inputOnFocus: true,
      value: ''
    })
  }
}

module.exports = myWidget