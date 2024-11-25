const { generateToken } = require('../utils/token');

class TeacherService {
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async getAllTeachers() {
        await this.unitOfWork.startTransaction();
        const teachers = await this.unitOfWork.teacherRepository.getAll();
        await this.unitOfWork.commit();
        return teachers;
    };

    async getTeacher(document) {
        await this.unitOfWork.startTransaction();
        const teacher = await this.unitOfWork.teacherRepository.getByDocument(document);
        await this.unitOfWork.commit();
        return teacher;
    }

    async createTeacher(teacherData) {
        try {
            await this.unitOfWork.startTransaction();
            const teacher = await this.unitOfWork.teacherRepository.create(teacherData);
            await this.unitOfWork.commit();
            return teacher;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al crear profesor: ${error.message}`);
        }
    };

    async updateTeacher(teacherData) {
        try {
            await this.unitOfWork.startTransaction();
            const teacher = await this.unitOfWork.teacherRepository.update(teacherData);
            await this.unitOfWork.commit();
            return teacher;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al editar profesor: ${error.message}`);
        }
    };

    async deleteTeacher(document) {
        try {
            await this.unitOfWork.startTransaction();
            await this.unitOfWork.teacherRepository.delete(document);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al eliminar profesor: ${error.message}`);
        }
    };

    async getAllTeachersStudentsPerSubjet() {
        await this.unitOfWork.startTransaction();
        const list = await this.unitOfWork.teacherRepository.getAllTeachersStudentsPerSubjet();
        await this.unitOfWork.commit();
        return this.formatList(list);
    };

    formatList(list){
        const result = Object.values(list.reduce((acc, record) => {
            const { TeacherID, TeacherName, SubjectID, SubjectName, StudentID, StudentName } = record;
        
            if (!acc[TeacherID]) {
                acc[TeacherID] = {
                    TeacherID,
                    TeacherName,
                    subjects: []
                };
            }
        
            let subject = acc[TeacherID].subjects.find(s => s.SubjectID === SubjectID);
            if (!subject) {
                subject = {
                    SubjectID,
                    SubjectName,
                    students: []
                };
                acc[TeacherID].subjects.push(subject);
            }
        
            subject.students.push({ StudentID, StudentName });
        
            return acc;
        }, {}));
        return result;
    };

    getToken() {
        return generateToken();
    };
}

module.exports = TeacherService;
