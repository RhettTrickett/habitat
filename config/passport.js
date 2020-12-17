var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var db = require('./database');
var bcrypt = require('bcrypt');

module.exports = passport.use('basic', new BasicStrategy((username, password, done) => {
  db.query('SELECT username, password FROM users WHERE username=$1', [username], (err, result) => {
    if(err) 
      return done(err);

    if(result.rows.length > 0) {
      console.log(username);
      console.log(password);
      const user = result.rows[0]
      bcrypt.compare(password, user.password, function(err, res) {
        if(res) {
          done(null, {username: user.username})
         } else {
          done(null, false)
         }
       })
     } else {
       done(null, false)
     }
  })
}))