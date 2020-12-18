var db = require('../config/database');
require('dotenv').config({path: __dirname + '/../../.env'})
const crypto = require("crypto");

exports.postNewFeed = function(req, res, next) {
    // Extract into variables from request body
    var { feed_name} = req.body;

    console.log(feed_name);
    
    // Check if the feed_name is valid

    let patt = /^[a-zA-Z0-9\s\-]+$/;
    var dataValid = (
        patt.test(feed_name)
    )
    
    if (dataValid)  {
        console.log('Valid feedname.');

        crypto.randomBytes(24, function(err, buffer) {
            var private_key = buffer.toString('hex');
            
                var insertSQL = "INSERT INTO feeds (name,private_key) VALUES ($1,$2);"
                var params = [feed_name,private_key]
                db.query(insertSQL, params, (error, result) => {
                    if (error) {
                        console.log(`Error: ${error}`)
                        res.status(400).send(error);
                    } else {
                        console.log(`New feed '${feed_name}' created `);
                        console.log(`with key '${private_key}'.\n`);
                        res.status(200).send(`New feed '${feed_name}' created with key '${private_key}'.\n`);
                        //process.exit(0);
                    }
                });
           });
           
        
    
    } else {
        res.status(400).send('Feed name must be only letters, numbers, spaces, or dashes' );
    }

}