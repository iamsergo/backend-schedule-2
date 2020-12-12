const ICell = require('./ICell')
const SingleCell = require('./SingleCell')

class QuarterCell extends ICell
{
  constructor(...args) { super(...args) }

  create()
  {
    const cells = []

    this.$td.each((i, td) => {
      const $td = this.$(td)
      
      if(!$td.text().trim()) return
      
      const k = i % 2
      const z = i <= 1 ? 0 : 1

      const cell = new SingleCell(this.$, $td, { ...this.coords, k, z })
      cells.push(cell.create())
    })

    return cells
  }
}

module.exports = QuarterCell