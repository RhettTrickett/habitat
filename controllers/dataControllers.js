var db = require('../config/database');
const fs = require('fs');
const fastcsv = require("fast-csv");
const CsvParser = require("json2csv").Parser;

exports.getLatestMeasurement = function(req, res, next) {

    var feed_id = req.params.feed_id;

    const query = `SELECT * FROM measurements WHERE feed_id = ${feed_id}  ORDER BY created DESC LIMIT 1`;

    db.query(query, (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
}

exports.getAllMeasurements = function(req, res, next) {

    var feed_id = req.params.feed_id;

    const query = `SELECT * FROM measurements WHERE feed_id = ${feed_id}  ORDER BY created DESC`;

    db.query(query, (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
}


exports.getCSV = function(req, res, next) {

    var feed_id = req.params.feed_id;

    var ws = fs.createWriteStream('measurements.csv');
    const tableName = 'measurements';

    const query = `SELECT * FROM ${tableName} WHERE feed_id = ${feed_id}`;

    /*
    const query = {
        text: 'SELECT * FROM $1 WHERE feed_id = $2',
        values: ['measurements','1'],
      }
    */
    // pass SQL string and table name to query()
db.query(query, (err, response) => {

    if (err) {
    console.log("client.query()", err.stack)
    }
    
    if (response) {
    
    const jsonData = JSON.parse(JSON.stringify(response.rows));
    console.log("\njsonData:", jsonData)
    
    const csvFields = ["id", "feed_id", "created","celcius"];

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(jsonData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=measurements.csv");

    //res.status(200).end(csvData);
    return res.status(200).send(csvData);
    }
});
}

exports.postNewMeasurement = function(req, res, next) {
    // Extract into variables from request body
    var {private_key, celcius, humidity } = req.body;

    var feed_id = req.params.feed_id;

    console.log(feed_id);
    console.log(private_key);
    console.log(celcius);
    console.log(humidity);

      const query = {
        text: 'SELECT * FROM feeds WHERE feed_id = $1',
        values: [feed_id],
      }

    console.log('poster key is:');
    console.log(private_key);

   db.query(query, (error, results) => {
    if (error)
        throw error;
        
    console.log("associated private_key is:");
    var key_to_match =results.rows[0].private_key;
    console.log(key_to_match);
    if(private_key==key_to_match) {
        console.log("key match!");

  // Check if values are int, float and float
  var dataValid = (
    //Number.isInteger(feed_id) &&
    typeof celcius == 'number' && !Number.isInteger(celcius) &&
    typeof humidity == 'number' && !Number.isInteger(humidity)
)

if (dataValid)  {
    // Create new measurement
    var insertSQL = `INSERT INTO measurements (feed_id, celcius, humidity) VALUES ($1, $2, $3);`
    var params = [feed_id, celcius, humidity]

    db.query(insertSQL, params, (error, result) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send('Measurement recorded\n');    
        }
    });

} else {
    res.status(400).send('Please check that your data types are correct' );
}

    }
    else{
        console.log("keys don't match!");
        res.status(400).send('Private key mismatch.\n' );

    }
});

}