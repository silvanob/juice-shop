const utils = require('../lib/utils')
const yaml = require('js-yaml')
const config = require('config')
const challenges = require('../data/datacache').challenges
const PRODUCTS = 'default'
const { safeLoad, dump } = require('js-yaml')
const util = require('util')
const fs = require('fs')
const path = require('path')
const readFile = util.promisify(fs.readFile)
const crypto = require('crypto')
const { pipeline } = require('stream')
const datacache = require('../data/datacache')
const logger = require('../lib/logger')
import models = require('../models/index')

module.exports = function ransomware () {
  return (req, res, next) => {
    if (utils.endsWith(req.path, '/encrypt')) {
      // Hier de encrypt functie aanroepen en iets returnen?
      if (!config.get('challenges.ransomwareStarted')) {
        encrypt('password')

      }

      // succesvol
      res.status(201).end()
    } else if (utils.endsWith(req.path, '/decrypt') && req.method === 'POST') {
      const decryptionCode = req.body?.decryptionCode // eslint-disable-line @typescript-eslint/no-unused-vars

      if (config.get('challenges.ransomwareStarted')) {
        decrypt('password')
        utils.solve(challenges.ransomwareChallenge)
      }
      // TODO schrijf een decrypt functie die de ingevoerde decryptionCode vergelijkt

      // succesvol
      res.status(201).end()
    }
  }
}

function loadStaticData (file) {
  const filePath = path.resolve('./config/' + file + '.yml')
  return readFile(filePath, 'utf8')
    .then(safeLoad)
    .catch(() => logger.error('Could not open file: "' + filePath + '"'))
}

function encrypt (key) {
  try {
    models.Product.findAll().then(products => {
      for (const product of products) {
        const cipher = crypto.createCipher('AES-128-CBC', key)
        let enc = cipher.update(product.name)
        enc = Buffer.concat([enc, cipher.final()]).toString('hex')
        product.update({ name: enc })
      }
    })
    const doc = yaml.load(fs.readFileSync('config/default.yml', 'utf8'))
    for (const p of doc.products) {
      const cipher = crypto.createCipher('AES-128-CBC', key)
      let enc = cipher.update(p.name)
      enc = Buffer.concat([enc, cipher.final()]).toString('hex')
      p.name = enc
    }
    doc.challenges.ransomwareStarted = true
    fs.writeFileSync('config/default.yml', dump(doc))
  } catch (e) {
    console.log(e)
  }
}

function decrypt (key) {
  try {
    models.Product.findAll().then(products => {
      for (const product of products) {
        const cipher = crypto.createDecipher('AES-128-CBC', key)
        const enc = Buffer.from(product.name, 'hex')
        let dec = cipher.update(enc)
        dec = Buffer.concat([dec, cipher.final()]).toString()
        product.update({ name: dec })
      }
    })
    const doc = yaml.load(fs.readFileSync('config/default.yml', 'utf8'))
    for (const p of doc.products) {
      const cipher = crypto.createDecipher('AES-128-CBC', key)
      const enc = Buffer.from(p.name, 'hex')
      let dec = cipher.update(enc)
      dec = Buffer.concat([dec, cipher.final()]).toString()
      p.name = dec
    }
    doc.challenges.ransomwareStarted = false
    fs.writeFileSync('config/default.yml', dump(doc))
  } catch (e) {
    console.log(e)
  }
}
