const needle = require('needle')

class BodyParser
{
  static async getHTML(url)
  {
    const res = await needle('get', url)
    return await res.body
  }
}

module.exports = BodyParser