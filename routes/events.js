const express = require("express")
const router = express.Router()

const BodyParser = require("../parser/BodyParser")
const Parser = require("../parser/Parser")

router.get('/events', async (req, res) => {
  const URL = `http://www.bstu.ru/about/press_center/events`

  const body = await BodyParser.getHTML(URL)
  const parser = new Parser(body)

  res.json(parser.getEvents())
});

module.exports = router