const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const UnitOfWork = require('../unitOfWork/unitOfWork');
const SubjectService = require('../services/subjectService');
const validate = require('../middlewares/validateMiddleware');
const accessAuth = require('../middlewares/accessAuth');
const { getSubjectByNameSchema, createSubjectSchema, editSubjectSchema, deleteSubjectByIdSchema } = require('../validation/subjectValidation');

const unitOfWork = new UnitOfWork(pool);
const subjectService = new SubjectService(unitOfWork);

router.get('/', async (req, res) => {
    try {
        const subjects = await subjectService.getAllSubjects();
        if(!subjects || subjects.length == 0) res.status(204).json();
        else res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:name', validate(getSubjectByNameSchema, 'params'), async (req, res) => {
    try {
        const subject = await subjectService.getSubject(req.params.name);
        if(subject && subject.length > 0) res.json(subject[0]);
        else res.status(404).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', accessAuth(), validate(createSubjectSchema), async (req, res) => {
    try {
        const subject = await subjectService.createSubject(req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/', accessAuth(), validate(editSubjectSchema), async (req, res) => {
    try {
        const subject = await subjectService.updateSubject(req.body);
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:idSubject', accessAuth(), validate(deleteSubjectByIdSchema, 'params'), async (req, res) => {
    try {
        await subjectService.deleteSubject(req.params.idSubject);
        res.status(200).json({ message: 'Materia eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
