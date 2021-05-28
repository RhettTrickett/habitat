require('dotenv').config({path: __dirname + '/../../.env'})
const prompt = require('prompt');
const db = require('../database');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

prompt.message = "";
prompt.delimiter = "";

  var schema = {
    properties: {
      username: {
        description: 'Username: ',
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        description: 'Password: ',
        hidden: true,
        required: true
      }
    }
  };


  console.log("Create admin user");

  prompt.start();

  prompt.get(schema, function (err, result) {
    var { username, password } = result;

        var hashedPassword = bcrypt.hashSync(password, salt);

        // Insert new user into users db table
        var insertSQL = "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3);"
        var params = [username, hashedPassword, true]
        db.query(insertSQL, params, (error, result) => {
            if (error) {
                console.log(`${error}`);
            } else {
              console.log(`Created '${username}' admin user.\n`);
                process.exit(0);
            }
        });
   });