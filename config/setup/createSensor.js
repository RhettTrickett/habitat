require('dotenv').config({path: __dirname + '/../../.env'})
const prompt = require('prompt');
const db = require('../database');

prompt.message = "";
prompt.delimiter = "";

  var schema = {
    properties: {
      sensorName: {
        description: 'Sensor name: ',
        pattern: /^[a-zA-Z0-9\s\-]+$/,
        message: 'Name must be only letters, numbers, spaces, or dashes',
        required: true
      }
    }
  };

  console.log("Create a sensor");

  prompt.start();

  prompt.get(schema, function (err, result) {
    var { sensorName } = result;

        var insertSQL = "INSERT INTO sensors (name) VALUES ($1);"
        var params = [sensorName]
        db.query(insertSQL, params, (error, result) => {
            if (error) {
                console.log(`Error: ${error}`)
            } else {
                console.log(`New sensor '${sensorName}' created.\n`)
                process.exit(0);
            }
        });
   });