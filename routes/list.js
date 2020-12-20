const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.get('/list', async (req, res) => {
  const users = await User.find({group:{$ne:''}})
  
  const institut_map = require('../institut_map.json')
  const instituts = Object.entries(institut_map)

  const data = users.reduce((data,u) => {
    if(u.group.includes('t')) return data

    const groupHref = u.group.replace('&','')

    for(const institut of instituts)
    {
      const [institutName, institutGroups] = institut

      const group = institutGroups.find(g => g.href === groupHref)      
      if(group)
      {
        if(data[institutName] === undefined)
        {
          return {...data, [institutName] : []}
        }
        else
        {
          const g = data[institutName].find(g => g.href === group.href)
          if(!g)
          {
            return {...data, [institutName] : [...data[institutName], {...group, count : 1}]} 
          }
          else
          {
            return {
              ...data,
              [institutName] : data[institutName].map(_g => {
                if(_g.href === g.href)
                  return {..._g, count : _g.count+1}

                return _g
              })
            }
          }
        }
      }
    }
  }, {})
  
  const d = Object.entries(data).reduce((data, institut) => {
    const [institutName, institutGroups] = institut

    const {count, groups} = institutGroups.reduce((data, group) => {
      return {
        count : data.count+group.count,
        groups : {...data.groups, [group.title] : group.count}
      }
    },{count : 0,groups:{}})

    return {
      instituts : { ...data.instituts, [institutName] : count },
      groups : {...data.groups, ...groups}
    }
  },{ instituts : {}, groups : {} })

  const _data = Object.entries(d).reduce((data, entrie) => {
    const [key, value] = entrie

    const sortValue = Object.entries(value)
                        .sort((a, b) => b[1] - a[1])
                        .reduce((data, [key,value]) => ({...data,[key]:value}),{})

    return {...data, [key] : sortValue}
  },{})

  res.json(_data)
})

module.exports = router