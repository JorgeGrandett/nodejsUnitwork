const Joi = require('joi');

const getSubjectByNameSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(50).required(),
});

const createSubjectSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(50).required(),
    idTeacher: Joi.number().positive().required()
});

const editSubjectSchema = Joi.object({
    idSubject: Joi.number().positive().required(),
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(50).required(),
    idTeacher: Joi.number().positive().required(),
    status: Joi.boolean().required()
});

const deleteSubjectByIdSchema = Joi.object({
    idSubject: Joi.number().positive().required()
});

module.exports = { getSubjectByNameSchema, createSubjectSchema, editSubjectSchema, deleteSubjectByIdSchema };