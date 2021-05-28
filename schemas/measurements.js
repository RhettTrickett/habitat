const Joi = require('joi')

module.exports.getMeasureSchema = Joi.object({
    limit: Joi.number()
            .integer()
            .min(0)
            .max(20),

    order: Joi.string()
            .valid('ASC', 'asc', 'DESC', 'desc'),

    sensor_id: Joi.number()
            .integer()
            .min(1),
})

module.exports.postMeasureSchema = Joi.object({
    sensor_id: Joi.number()
            .integer()
            .min(1),

    celcius: Joi.number()
            .min(0),

    humidity: Joi.number()
            .min(0)
            .max(100),

    light: Joi.number()
            .min(0)
            .integer(),

    humidity: Joi.number()
            .min(0)
            .max(100),
})