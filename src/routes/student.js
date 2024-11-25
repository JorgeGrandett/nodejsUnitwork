const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const UnitOfWork = require('../unitOfWork/unitOfWork');
const StudentService = require('../services/studentService');
const validate = require('../middlewares/validateMiddleware');
const accessAuth = require('../middlewares/accessAuth');
const { getDeleteStudentByDocumentSchema, createStudentSchema, editStudentSchema, matriculateCancelSubjectSchema } = require('../validation/studentValidation');

const unitOfWork = new UnitOfWork(pool);
const studentService = new StudentService(unitOfWork);

router.get('/', accessAuth(), async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        if(!students || students.length == 0) res.status(204).json();
        else res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:document', accessAuth(), validate(getDeleteStudentByDocumentSchema, 'params'), async (req, res) => {
    try {
        const student = await studentService.getStudent(req.params.document);
        if(student && student.length > 0) res.json(student[0]);
        else res.status(404).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', validate(createStudentSchema), async (req, res) => {
    try {
        const student = await studentService.createStudent(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/', accessAuth(), validate(editStudentSchema), async (req, res) => {
    try {
        const student = await studentService.updateStudent(req.body);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:document', accessAuth(), validate(getDeleteStudentByDocumentSchema, 'params'), async (req, res) => {
    try {
        await studentService.deleteStudent(req.params.document);
        res.status(200).json({ message: 'Estudiante eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/matriculate', validate(matriculateCancelSubjectSchema), async (req, res) => {
    try {
        const matriculation = await studentService.matriculateStudent(req.body);
        res.status(201).json(matriculation);
    } catch (error) {
        if(error.message.includes("inhablitado")) res.status(400);
        else if(error.message.includes("no registra")) res.status(404);
        else if(error.message.includes("disponibles") || error.message.includes("matriculada")) res.status(409);
        else res.status(500);
        res.json({ error: error.message });
    }
});

router.post('/matriculate/cancel', validate(matriculateCancelSubjectSchema), async (req, res) => {
    try {
        const cancel = await studentService.subjectCancelStudent(req.body);
        res.status(201).json(cancel);
    } catch (error) {
        if(error.message.includes("inhablitado")) res.status(400);
        else if(error.message.includes("no registra")) res.status(404);
        else res.status(500);
        res.json({ error: error.message });
    }
});

router.get('/classmates/:document', validate(getDeleteStudentByDocumentSchema, 'params'), async (req, res) => {
    try {
        const list = await studentService.classmatesList(req.params.document);
        res.status(200).json(list);
    } catch (error) {
        if(error.message.includes("inhablitado")) res.status(400);
        else if(error.message.includes("no registra")) res.status(404);
        else res.status(500);
        res.json({ error: error.message });
    }
});

router.get('/detail/:document', validate(getDeleteStudentByDocumentSchema, 'params'), async (req, res) => {
    try {
        const list = await studentService.studentDetail(req.params.document, req.app.get('exchangeRate'));
        res.status(200).json(list);
    } catch (error) {
        if(error.message.includes("inhablitado")) res.status(400);
        else if(error.message.includes("no registra")) res.status(404);
        else res.status(500);
        res.json({ error: error.message });
    }
});

module.exports = router;
