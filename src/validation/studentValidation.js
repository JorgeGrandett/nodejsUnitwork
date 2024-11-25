const Joi = require('joi');

const getDeleteStudentByDocumentSchema = Joi.object({
    document: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required()
});

const createStudentSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(100).required(),
    documentNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required(),
    gender: Joi.string().max(1).valid('M', 'F', 'O').required()
});

const editStudentSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(100).required(),
    documentNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required(),
    gender: Joi.string().max(1).allow('M', 'F', 'O').required(),
    status: Joi.boolean().required()
});

const matriculateCancelSubjectSchema = Joi.object({
    studentDocumentNumber: Joi.string().pattern(/^[0-9]+$/, 'numbers').max(11).required(),
    idSubject: Joi.number().positive().required()
});

module.exports = { getDeleteStudentByDocumentSchema, createStudentSchema, editStudentSchema, matriculateCancelSubjectSchema };