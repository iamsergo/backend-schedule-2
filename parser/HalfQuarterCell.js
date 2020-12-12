const ICell = require('./ICell')
const SingleCell = require('./SingleCell')

class HalfQuarterCell extends ICell
{
  constructor(...args) { super(...args) }

  create()
  {
    const cells = []

    this.$td.each((k, td) => {
      const $td = this.$(td)
      
      if(!$td.text().trim()) return
      
      const cell = new SingleCell(this.$, $td, { ...this.coords, k })
      cells.push(cell.create())
    })

    return cells
  }
}

module.exports = HalfQuarterCell