import Joi from "joi";

export const createCategoryValidation = (payload) => {
    const schema = Joi.object({
        category: Joi.string().required(),
    });
    return schema.validate(payload);
}

export const updateCategoryValidation = (payload) => {
    const schema = Joi.object({
        category: Joi.string(),
    }).min(1);
    return schema.validate(payload);
}
    