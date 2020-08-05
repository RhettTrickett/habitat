var db = require('../config/database');

exports.getLatestMeasurement = function(req, res, next) {
    db.query('SELECT * FROM measurements ORDER BY created DESC LIMIT 1;', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
}


exports.postNewMeasurement = function(req, res, next) {

    // Extract into variables from request body
    var { sensor_id, celcius, humidity } = req.body;

    // Check if values are int, float and float
    var dataValid = (
        Number.isInteger(sensor_id) &&
        typeof celcius == 'number' && !Number.isInteger(celcius) &&
        typeof humidity == 'number' && !Number.isInteger(humidity)
    )
    
    if (dataValid)  {
        // Create new measurement
        var insertSQL = `INSERT INTO measurements (sensor_id, celcius, humidity) VALUES ($1, $2, $3);`
        var params = [sensor_id, celcius, humidity]

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