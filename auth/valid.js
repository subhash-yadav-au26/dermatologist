const Joi = require('joi');

exports.reg_valid = (data) => {

    const regSchema = Joi.object({
        username: Joi.string()
            .min(5)
            .max(255)
            .required(),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),

        password: Joi.string()
            .min(5)
            .max(16)
            .required(),

        profile: Joi.string()
            .default(null),

        isAdmin: Joi.boolean()
            .default(false)
    })
    return regSchema.validate(data);
}


exports.login_valid = (data) => {
    const loginSchema = Joi.object({

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),

        password: Joi.string()
            .min(5)
            .max(16)
            .required(),
    })
    return loginSchema.validate(data);
}


exports.booking_valid = (data) => {

    const bookingSchema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(255)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        phone:Joi.string()
            .min(10)
            .max(10)
            .required(),

        city:Joi.string()
        .required(),

        date:Joi.string()
        .required(),

        message:Joi.string()
        .required()
        
    })
    return bookingSchema.validate(data);
}


exports.doctor_valid = (data) => {

    const doctorSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),

        specialist: Joi.string()
            .required(),

        qualification: Joi.string()
            .required(),

        expirence:Joi.string()
        .required(),

        profile:Joi.string()
        .default(null)
    })
    return doctorSchema.validate(data);
}


exports.banner_valid = (data) => {
    const bannerSchema = Joi.object({
        picture:Joi.string()
        .required(),
    })
    return bannerSchema.validate(data);
}


exports.comment_valid = (data) => {

    const commentSchema = Joi.object({

        comment: Joi.string()
            .required(),

        star:Joi.array()
        .default(5),
    })
    return commentSchema.validate(data);
}