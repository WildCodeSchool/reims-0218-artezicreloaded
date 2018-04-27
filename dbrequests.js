const sqlite = require('sqlite')
const Promise = require('bluebird')
const express = require('express')


let dbb

const dbPromise = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', {
    Promise
  }))
  .then(_db => {
    dbb = _db
  })

module.exports = {
    userLogin: function (username, password) {
        return dbb.get(`SELECT id, pseudo AS username, password from wilders WHERE pseudo="${username}"`)
    }
}