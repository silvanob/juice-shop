const utils = require('../lib/utils')
const challenges = require('../data/datacache').challenges

module.exports = function ransomware () {
  return (req, res, next) => {
    const decryptionCode = req.body?.decryptionCode

    // TODO schrijf een decrypt functie die de ingevoerde decryptionCode vergelijkt
    utils.solve(challenges.ransomwareChallenge)
    res.status(201)
    res.json({ hello: '51' })
  }
}
