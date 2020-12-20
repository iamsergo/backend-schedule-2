const cheerio = require('cheerio')
const fs = require('fs')

const SingleCell = require('./SingleCell')
const DoubleCell = require('./DoubleCell')
const QuarterCell = require('./QuarterCell')
const HalfQuarterCell = require('./HalfQuarterCell')

class Parser
{
  constructor(body)
  {
    this.$ = cheerio.load(body)

    // const page = fs.readFileSync('./index.html', { encoding : 'utf8' })
    // this.$ = cheerio.load(page)
  }

  getGroupExams()
  {
    const exams = []
    
    const $tds = this.$('body > table.schedule:last-of-type > tbody > tr > td.schedule_std')
    $tds.each((i, td) => {
      const $td = this.$(td)

      const date = $td.find('th.schedule').text().trim()
      const place = $td.find('div[class^=place_]').text().trim()
      const subject = $td.find('div[class^=subject_]').text().trim()

      const fromWhoms = []
      $td.find('div[class^=sp_]').find('a').each((i, a) => {
        const $a = this.$(a)
        const title = $a.attr('title')

        fromWhoms.push({
          title : title ? title.replace(/^ст.пр.|доц.|преп.|проф./, '').trim() : $a.text().trim(),
          href : $a.attr('href')
        })
      })

      exams.push({
        place : `${date} ${place}`,
        subject,
        type : subject === 'Консультация' ? 3 : 4,
        fromWhoms
      })
    })

    return exams
  }

  getTeacherExams(selector)
  {
    const exams = []

    const $table = this.$(selector)
    const $trs = $table.find('.dark, .light')
    $trs.each((i, tr) => {
      const $tr = this.$(tr)
      const $tds = $tr.children('td')

      const date = $tds.eq(0).text().trim()
      const place = $tds.eq(1).text().trim()
      const typeExam = $tds.eq(2).text().trim()
      
      let type
      if(typeExam.includes('конс')) type = 3
      else if(typeExam.includes('экз')) type = 4
      const subject = $tds.eq(3).text().trim()
      
      const fromWhoms = []
      $tds.eq(4).find('a').each((i, a) => {
        const $a = this.$(a)

        fromWhoms.push({
          title : $a.text().trim(),
          href : $a.attr('href')
        })
      })

      exams.push({
        place : `${date} ${place} ${typeExam}`,
        subject : `${subject}`,
        type,
        fromWhoms        
      })
    })

    return exams
  }

  getExams(isGroup)
  {
    const selector = isGroup
      ? 'body > table.schedule:last-of-type'
      : 'body > table[class^=schedule]:nth-of-type(2)'
    const $table = this.$(selector)

    if(!$table.length || !$table.find('.top_banner_post').length) return

    return isGroup
      ? this.getGroupExams()
      : this.getTeacherExams(selector)
  }

  getSchedule(href)
  {
    const table = this.$('body > table.schedule:first-of-type > tbody')

    const data = {
      title : this.$('.top_banner').text().trim(),
      href,
      schedule : [],
      exams : this.getExams(href.includes('g')),
    }

    const $trs = table.children('tr')
    const $rows = $trs.slice(2, $trs.length - 1)    
    $rows.each((j, row) => {
      const $tr = this.$(row)

      const $tds = $tr.children('td.schedule_std')

      $tds.each((i, column) => {
        const $td = this.$(column)
        
        // Если есть занятие (ячейка не пустая)
        if($td.text().trim())
        {

          // Одиночная ячейка
          if($td.children('div').length)
          {
            const cell = new SingleCell(this.$, $td, { j, i })
            data.schedule.push(cell.create())
          }
          
          // Множественная ячейка
          else
          {
            let $tds
            
            // Верх/низ
            $tds = $td.find('td.schedule_half')
            if($tds.length)
            {
              const cell = new DoubleCell(this.$, $tds, { j, i })
              data.schedule.push(...cell.create())
              return
            }

            // Лево/право
            $tds = $td.find('td.schedule_hq')
            if($tds.length)
            {
              const cell = new HalfQuarterCell(this.$, $tds, { j, i })
              data.schedule.push(...cell.create())
              return
            }

            // Четверть
            $tds = $td.find('td.schedule_quarter')
            if($tds.length)
            {
              const cell = new QuarterCell(this.$, $tds, { j, i })
              data.schedule.push(...cell.create())
              return
            }            
          }

        }
        
      })
    })

    return data
  }
  
  getFromWhoms(schedule)
  {
    const fromWhoms = []

    schedule.forEach(s => {
      s.fromWhoms.forEach(sfw => {
        if(fromWhoms.find(fw => fw.href === sfw.href)) return
        
        fromWhoms.push(sfw)
      })
    })

    return fromWhoms
  }

  getStream()
  {
    return {
      title : this.$('h1').text()
                .replace('Трансляция из аудитории','')
                .replace('БГТУ им. В.Г.Шухова','')
                .replace('БГТУ им. В.Г. Шухова','')
                .trim().split(' ').join(''),
      href : this.$('iframe').attr('src')
              .replace('?wmode=transparent&autoplay=0','')
              .replace('https://www.youtube.com/embed/','https://www.youtube.com/watch?v='),
    }
  }
}

module.exports = Parser