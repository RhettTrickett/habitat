require('dotenv').config({path: __dirname + '/../../.env'})
const prompt = require('prompt');
const db = require('../database');
const crypto = require("crypto");

//console.log("host:");
//console.log(db.host);

prompt.message = "";
prompt.delimiter = "";

  var schema = {
    properties: {
      feedName: {
        description: 'Feed name: ',
        pattern: /^[a-zA-Z0-9\s\-]+$/,
        message: 'Name must be only letters, numbers, spaces, or dashes',
        required: true
      }
    }
  };

  console.log("Create a feed");


  prompt.start();

  prompt.get(schema, function (err, result) {
    var { feedName } = result;

    
  const private_key = crypto.createHash("sha256");

  console.log('private key:');
  var token;

  require('crypto').randomBytes(24, function(err, buffer) {
    var private_key = buffer.toString('hex');
    
        var insertSQL = "INSERT INTO feeds (name,private_key) VALUES ($1,$2);"
        var params = [feedName,private_key]
        db.query(insertSQL, params, (error, result) => {
            if (error) {
                console.log(`Error: ${error}`)
            } else {
                console.log(`New feed '${feedName}' created `);
                console.log(`with key '${private_key}'.\n`);
                process.exit(0);
            }
        });
   });

  });