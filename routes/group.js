const express = require('express')
const router = express.Router()

const Parser = require('../parser/Parser')
const BodyParser = require('../parser/BodyParser')
const User = require('../models/User')

router.put('/user/group', async (req, res) => {
  const { uid, group } = req.body
  
  const g = group.replace(/(\?|&)/g,'')
  
  await User.updateOne({ id : uid }, { $set : { group : `?${g}` } })

  const BASE_URL = 'https://www.bstu.ru/static/themes/bstu/schedule/index.php?'
  
  const URL = `${BASE_URL}${g}`
  const body = await BodyParser.getHTML(URL)
  const parser = new Parser(body)

  const myGroup = parser.getSchedule(`?${g}`)
  const fromWhoms = parser.getFromWhoms(myGroup.schedule)
  
  res.json({ id : uid, group, myGroup, fromWhoms})
} )

router.delete('/user/group', async (req, res) => {
  const { uid } = req.body
  
  await User.updateOne({ id : uid }, { $set : { group : '' } })
  
  res.json({success:true})
} )

module.exports = router