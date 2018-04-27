const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const sqlite = require('sqlite')

let db

/* POST login. */
router.post('/login', function (req, res, next) {
  //TODO this is artificial, will test only for Gontran.
  //We need to make it dynamically
    db.all('SELECT * from wilders WHERE id="1"')
    .then(user => {
      res.json(user)
    })

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            })
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err)
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, 'your_jwt_secret')
           return res.json({user, token})
        })
    })(req, res)
})

module.exports = router