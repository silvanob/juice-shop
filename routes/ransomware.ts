/* eslint-disable node/no-deprecated-api */
import models = require('../models/index')
const utils = require('../lib/utils')
const yaml = require('js-yaml')
let config = require('config')
const challenges = require('../data/datacache').challenges
const { dump } = require('js-yaml')
const fs = require('fs')
const crypto = require('crypto')
const mongodb = require('../data/mongodb')

module.exports = function ransomware () {
  return (req, res, next) => {
    const challengeStarted = config.get('challenges.ransomwareStarted')
    if (utils.endsWith(req.path, '/encrypt')) {
      if (!challengeStarted) {
        encrypt('password')
      }
      res.status(201).end()
    } else if (utils.endsWith(req.path, '/decrypt') && req.method === 'POST') {
      const decryptionCode = req.body?.decryptionCode // eslint-disable-line @typescript-eslint/no-unused-vars
      if (challengeStarted) {
        if (decryptionCode === 'password') {
          decrypt(decryptionCode)
          utils.solve(challenges.ransomwareChallenge)
          res.status(201).json({
            text: 'Correct decryption code.'
          })
        } else {
          res.status(401).send(res.__('Invalid decryption key.'))
        }
      }
    } else if (utils.endsWith(req.path, '/started') && req.method === 'GET') {
      res.status(200).send(challengeStarted).end()
    }
  }
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
    mongodb.reviews.find().then(reviews => {
      for (const review of reviews) {
        const cipher = crypto.createCipher('AES-128-CBC', key)
        let enc = cipher.update(review.message)
        enc = Buffer.concat([enc, cipher.final()]).toString('hex')
        mongodb.reviews.update({ _id: review._id }, { $set: { message: enc } })
      }
    })
    const doc = yaml.load(fs.readFileSync('config/default.yml', 'utf8'))
    for (const p of doc.products) {
      const cipher = crypto.createCipher('AES-128-CBC', key)
      let enc = cipher.update(p.name)
      enc = Buffer.concat([enc, cipher.final()]).toString('hex')
      p.name = enc
      if (p.reviews) {
        for (const r of p.reviews) {
          const cipher1 = crypto.createCipher('AES-128-CBC', key)
          let enc1 = cipher1.update(r.text)
          enc1 = Buffer.concat([enc1, cipher1.final()]).toString('hex')
          r.text = enc1
        }
      }
    }
    doc.challenges.ransomwareStarted = true
    fs.writeFileSync('config/default.yml', dump(doc))
    reloadConfig()
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
    mongodb.reviews.find().then(reviews => {
      for (const review of reviews) {
        const cipher = crypto.createDecipher('AES-128-CBC', key)
        const enc = Buffer.from(review.message, 'hex')
        let dec = cipher.update(enc)
        dec = Buffer.concat([dec, cipher.final()]).toString()
        mongodb.reviews.update({ _id: review._id }, { $set: { message: dec } })
      }
    })
    const doc = yaml.load(fs.readFileSync('config/default.yml', 'utf8'))
    for (const p of doc.products) {
      const cipher = crypto.createDecipher('AES-128-CBC', key)
      const enc = Buffer.from(p.name, 'hex')
      let dec = cipher.update(enc)
      dec = Buffer.concat([dec, cipher.final()]).toString()
      p.name = dec
      if (p.reviews) {
        for (const r of p.reviews) {
          const cipher1 = crypto.createDecipher('AES-128-CBC', key)
          const enc1 = Buffer.from(r.text, 'hex')
          let dec1 = cipher1.update(enc1)
          dec1 = Buffer.concat([dec1, cipher1.final()]).toString('hex')
          r.text = dec1
        }
      }
    }
    doc.challenges.ransomwareStarted = false
    fs.writeFileSync('config/default.yml', dump(doc))
    reloadConfig()
  } catch (e) {
    console.log(e)
  }
}

function reloadConfig () {
  global.NODE_CONFIG = null
  delete require.cache[require.resolve('config')] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  config = require('config')
}
