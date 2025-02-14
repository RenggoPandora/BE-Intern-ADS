const Joi = require("joi");

const createCategoryValidation = (payload) => {
    const schema = Joi.object({
        category: Joi.string().required(),
    });
    return schema.validate(payload);
}

const updateCategoryValidation = (payload) => {
    const schema = Joi.object({
        category: Joi.string(),
    }).min(1);
    return schema.validate(payload);
}

module.exports = {
    createCategoryValidation,
    updateCategoryValidation
};
