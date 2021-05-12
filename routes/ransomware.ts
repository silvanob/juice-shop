const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges

module.exports = function ransomware () {
  return (req, res, next) => {
    if (utils.endsWith(req.path, '/encrypt')) {
      // Hier de encrypt functie aanroepen en iets returnen?

      // succesvol
      res.status(201).end()
    } else if (utils.endsWith(req.path, '/decrypt') && req.method === 'POST') {
      const decryptionCode = req.body?.decryptionCode // eslint-disable-line @typescript-eslint/no-unused-vars

      // TODO schrijf een decrypt functie die de ingevoerde decryptionCode vergelijkt

      // succesvol
      utils.solve(challenges.ransomwareChallenge)
      res.status(201).end()
    }
  }
}
