const ICell = require('./ICell')

class SingleCell extends ICell
{
  constructor($, $td, coords) {
    const cs = {
      ...coords,
      j : coords.j > 2 ? coords.j + 1 : coords.j,
    }

    super($, $td, cs)
  }

  fromWhoms($as)
  {
    if($as.length === 0) return []

    const fw = []
    $as.each((i, a) => {
      const $a = this.$(a)
      const title = $a.attr('title')
      fw.push({
        title : title ? title.replace(/^ст.пр.|доц.|преп.|проф./, '').trim() : $a.text(),
        href : $a.attr('href'),
      })
    })

    return fw
  }

  create()
  {
    const place = this.$td.find('div[class^=place_]').text().trim()
    const subject = this.$td.find('.center_p').text().trim()
    const fromWhoms = this.fromWhoms(this.$td.find('div[class^=sp_] a'))
    const typeLesson = { 'лек' : 0, 'пр' : 1, 'лаб' : 2 }
    const type = typeLesson[this.$td.find(`div[class^=place_]`).contents().eq(0).text().trim()]
    const coords = {
      ...this.coords,
      j : this.coords.j + ((this.coords.j === 2 && this.$td.find('.break_top').length) ? 1 : 0)
    }

    return {
      place,
      type,
      subject,
      coords,
      fromWhoms
    }
  }
}

module.exports = SingleCell