const Joi = require('joi');
const HttpError = require('./HttpError');
module.exports = (req,res,next) => {
    schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string(),
        imageurl: Joi.string().required(),
    })
    const result = schema.validate(req.body)
    // console.log(req.body,result.error.details,result.error.details.map(el => el.message).join(','))
    if(result.error) throw new HttpError(result.error.details.map(el => el.message).join(','),400)
    else next()


}