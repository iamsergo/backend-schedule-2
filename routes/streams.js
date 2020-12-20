const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')

const BodyParser = require('../parser/BodyParser')
const Parser = require('../parser/Parser')

router.get('/streams', async (req, res) => {
  const URL = 'http://stream.bstu.ru/'
  const body = await BodyParser.getHTML(URL)
  const $ = cheerio.load(body)
  
  const linksPromises = []
  $('h2 a').each((i, a) => {
    const link = $(a).attr('href')
    
    linksPromises.push(
      new Promise(async (resolve, reject) => {
        const body = await BodyParser.getHTML(link)
        const p = new Parser(body)
        resolve(p.getStream())
      })
    )
  })

  const streams = await Promise.all(linksPromises)
  
  res.json(streams)
})

module.exports = router