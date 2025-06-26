const joi = require('joi')

exports. registerUserSchema = joi.object().keys({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().trim().email().required(),
    password :joi.string().trim().required(),
})

exports. loginUserSchema = joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})