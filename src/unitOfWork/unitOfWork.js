const StudentRepository = require('../repositories/studentRepository');
const TeacherRepository = require('../repositories/teacherRepository');
const SubjectRepository = require('../repositories/subjectRepository');
const StudentsSubjectsRepository = require('../repositories/studentsSubjectsRepository');

class UnitOfWork {
    constructor(pool) {
        this.pool = pool;
        this.connection = null;
    }

    async startTransaction() {
        this.connection = await this.pool.getConnection();
        await this.connection.beginTransaction();
        this.studentRepository = new StudentRepository(this.connection);
        this.teacherRepository = new TeacherRepository(this.connection);
        this.subjectRepository = new SubjectRepository(this.connection);
        this.studentsSubjectsRepository = new StudentsSubjectsRepository(this.connection);
    }

    async commit() {
        if (this.connection) {
            await this.connection.commit();
            this.connection.release();
        }
    }

    async rollback() {
        if (this.connection) {
            await this.connection.rollback();
            this.connection.release();
        }
    }
}

module.exports = UnitOfWork;
