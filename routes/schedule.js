const express = require('express')
const router = express.Router()

const BodyParser = require('../parser/BodyParser')
const Parser = require('../parser/Parser')

router.get('/schedule/:gtid/:id', async (req, res) => {
  const { gtid, id } = req.params
  
  const BASE_URL = 'https://www.bstu.ru/static/themes/bstu/schedule/index.php?'
  const URL = `${BASE_URL}${gtid}=${id}`

  const body = await BodyParser.getHTML(URL)
  const parser = new Parser(body)
  
  res.json(parser.getSchedule(`?${gtid}=${id}`))
} )

module.exports = router