import frisby = require('frisby')

const REST_URL = 'http://localhost:3000/rest'

const jsonHeader = { 'content-type': 'application/json' }

describe('/rest/ransomware', () => {
  describe('/decrypt', () => {
    xit('Should send 201 after POST', () => {
      return frisby.post(REST_URL + '/ransomware/decrypt', {
        headers: jsonHeader,
        body: {
          decryptionCode: 'password'
        }
      })
        .expect('status', 201)
    })
  })

  describe('/encrypt', () => {
    // when encrypt is added
  })
})
