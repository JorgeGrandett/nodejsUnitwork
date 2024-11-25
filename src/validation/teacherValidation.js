const Joi = require('joi');

const getDeleteTeacherByDocumentSchema = Joi.object({
    document: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required()
});

const createTeacherSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(100).required(),
    documentNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required(),
    gender: Joi.string().max(1).valid('M', 'F', 'O').required()
});

const editTeacherSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(100).required(),
    documentNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required(),
    gender: Joi.string().max(1).allow('M', 'F', 'O').required(),
    status: Joi.boolean().required()
});

module.exports = { getDeleteTeacherByDocumentSchema, createTeacherSchema, editTeacherSchema };