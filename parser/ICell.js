class ICell
{
    /**
   * @i number of day [0...5]
   * @j number of lesson [0...7] [08-15...20-??]
   * @k group [0...2]
   * @z week [0...2]
   */
  constructor($, $td, coords)
  {
    this.$ = $
    this.$td = $td
    this.coords = {
      ...coords,
      k : coords.k === 0 ? 0 : (coords.k || 2),
      z : coords.z === 0 ? 0 : (coords.z || 2),
    }
  }

  create()
  {
    throw new Error(`Don't implements ICell.create() method`)
  }
}

module.exports = ICell