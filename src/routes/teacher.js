const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const UnitOfWork = require('../unitOfWork/unitOfWork');
const TeacherService = require('../services/teacherService');
const validate = require('../middlewares/validateMiddleware');
const accessAuth = require('../middlewares/accessAuth');
const { getDeleteTeacherByDocumentSchema, createTeacherSchema, editTeacherSchema } = require('../validation/teacherValidation');

const unitOfWork = new UnitOfWork(pool);
const teacherService = new TeacherService(unitOfWork);

router.get('/token', async (req, res) => {
    try {
        const token = teacherService.getToken();
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', accessAuth(), async (req, res) => {
    try {
        const teachers = await teacherService.getAllTeachers();
        if(!teachers || teachers.length == 0) res.status(204).json();
        else res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:document', accessAuth(), validate(getDeleteTeacherByDocumentSchema, 'params'), async (req, res) => {
    try {
        const teacher = await teacherService.getTeacher(req.params.document);
        if(teacher && teacher.length > 0) res.json(teacher[0]);
        else res.status(404).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', accessAuth(), validate(createTeacherSchema), async (req, res) => {
    try {
        const teacher = await teacherService.createTeacher(req.body);
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/', accessAuth(), validate(editTeacherSchema), async (req, res) => {
    try {
        const teacher = await teacherService.updateTeacher(req.body);
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:document', accessAuth(), validate(getDeleteTeacherByDocumentSchema, 'params'), async (req, res) => {
    try {
        await teacherService.deleteTeacher(req.params.document);
        res.status(200).json({ message: 'Profesor eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/matriculate/all', accessAuth(), async (req, res) => {
    try {
        const list = await teacherService.getAllTeachersStudentsPerSubjet();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
