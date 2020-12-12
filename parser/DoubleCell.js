const ICell = require('./ICell')
const SingleCell = require('./SingleCell')

class DoubleCell extends ICell
{
  constructor(...args) { super(...args) }

  create()
  {
    const cells = []

    this.$td.each((z, td) => {
      const $td = this.$(td)
      
      if(!$td.text().trim()) return

      const cell = new SingleCell(this.$, $td, { ...this.coords, z })
      cells.push(cell.create())
    })

    return cells
  }
}

module.exports = DoubleCell