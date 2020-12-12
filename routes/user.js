const express = require('express')
const router = express.Router()

const BodyParser = require('../parser/BodyParser')
const Parser = require('../parser/Parser')
const User = require('../models/User')

router.get('/user/:id', async (req, res) => {
  const { id } = req.params

  const doc = await User.findOne({ id : +id })

  if(doc)
  {
    const user = await doc.toJSON()

    let payload = { myGroup : null, fromWhoms : []}
    if(user.group)
    {
      const BASE_URL = 'http://www.bstu.ru/static/themes/bstu/schedule/index.php?'
      const group = user.group.replace(/(\?|&)/g,'')
      const URL = `${BASE_URL}${group}`

      const body = await BodyParser.getHTML(URL)
      const parser = new Parser(body)

      const myGroup = parser.getSchedule(`?${group}`)
      payload = {myGroup, fromWhoms : parser.getFromWhoms(myGroup.schedule)}
    }

    res.json({ ...user, ...payload })
  }
  else
  {
    res.json(null)
  }
} )

router.post('/user/:id', async (req, res) => {
  const { id } = req.params
  
  const doc = await User.create({ id : +id, group : '' })
  const user = await doc.toJSON()
  
  const {id : uid, group} = user
  
  res.json({id : uid, group, myGroup : null, fromWhoms : []})
} )

module.exports = router