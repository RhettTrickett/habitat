var db = require('../config/database');
const { getMeasureSchema, postMeasureSchema } = require('../schemas/measurements')

exports.getMeasurements = function(req, res, next) {
    const params =  { limit, order, sensor_id } = req.query
    const validated = getMeasureSchema.validate(params)

    if (validated.error) {
        return res.status(400).json({'error': validated.error.details.message})
    }

    // Do not let users pass values into query directly
    params.order = params.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    params.limit = params.limit ? params.limit : 20;
    const query = `SELECT * FROM measurements ORDER BY id ${params.order} LIMIT $1;`

    db.query(query, [params.limit], (error, results) => {
        if (error) {
            console.log(error)
           return res.status(500).json({'error': 'a server error occurred'});
        }
        return res.status(200).json(results.rows);
    });
}

exports.getLatestTemp = function(req, res, next) {
    db.query('SELECT * FROM measurements ORDER BY created DESC LIMIT 1;', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows[0].celcius);
    });
}


exports.postMeasurement = function(req, res, next) {

    // Extract into variables from request body
    var { sensor_id, celcius, humidity } = req.body;
    console.log(req.body);

    // Check if values are int, float and float
    var dataValid = (
        Number.isInteger(sensor_id) &&
        typeof celcius == 'number' &&
        typeof humidity == 'number'
    )
    
    if (dataValid)  {
        // Create new measurement
        var insertSQL = `INSERT INTO measurements (sensor_id, celcius, humidity) VALUES ($1, $2, $3);`
        var params = [sensor_id, celcius, humidity]

        db.query(insertSQL, params, (error, result) => {
            if (error) {
                res.status(400).send(error);
            } else {
                res.status(200).send('Saved to database\n');    
            }
        });
    
    } else {
        res.status(400).send('Please check that your data types are correct' );
    }


}
