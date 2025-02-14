import Joi from "joi";

export const createClassValidation = (payload) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        type: Joi.string().valid("PREMIUM","GRATIS").required(),
        level: Joi.string().required(),
        price: Joi.string().required(),
        content: Joi.string().required(),
        categoryId: Joi.string().required(),
    });
    return schema.validate(payload);
}

export const updateClassValidation = (payload) => {
    const schema = Joi.object({
        name: Joi.string(),
        code: Joi.string(),
        type: Joi.string().valid("PREMIUM","GRATIS"),
        level: Joi.string(),
        price: Joi.string(),
        content: Joi.string(),
        categoryId: Joi.string(),
    }).min(1);
    return schema.validate(payload);
}