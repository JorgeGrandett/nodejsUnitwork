class StudentsSubjectsRepository {
    TABLE_NAME = 'students_subjects';
    SUBJECTS_TABLE = 'subjects';
    TEACHERS_TABLE = 'teachers';
    VALIDATE_EXISTING_SUBJECTS= `SELECT COUNT(*) AS existing_records, t.name AS teacher_name 
        FROM ${this.TABLE_NAME} ss 
        JOIN ${this.SUBJECTS_TABLE} sub1 ON ss.id_subject = sub1.id_subject 
        JOIN ${this.SUBJECTS_TABLE} sub2 ON sub1.id_teacher = sub2.id_teacher 
        JOIN ${this.TEACHERS_TABLE} t ON sub2.id_teacher = t.id_teacher
        WHERE ss.id_student = ? AND sub2.id_subject = ?`;

    INSERT = `INSERT INTO ${this.TABLE_NAME} (id_student, id_subject) VALUES (?, ?)`;
    DELETE = `DELETE FROM ${this.TABLE_NAME} WHERE id_student = ? AND id_subject = ?`

    constructor(connection) {
        this.connection = connection;
    };

    async validateExistingSubjects(idStudent, idSubject) {
        const [row] = await this.connection.query(this.VALIDATE_EXISTING_SUBJECTS, [idStudent, idSubject]);
        return row[0];
    };
    
    async matriculate(idStudent, idSubject) {
        const [result] = await this.connection.query(this.INSERT, [idStudent, idSubject]);
        return { id: result.insertId };
    };

    async cancelSubject(idStudent, idSubject) {
        const [result] = await this.connection.query(this.DELETE, [idStudent, idSubject]);
        return { affectedRows: result.affectedRows };
    };

}

module.exports = StudentsSubjectsRepository;
