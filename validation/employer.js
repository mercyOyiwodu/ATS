const joi = require('joi')

exports. registerEmployerSchema = joi.object().keys({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().trim().email().required(),
    password :joi.string().trim().required(),
})

exports. loginEmployerSchema = joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})