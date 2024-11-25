class StudentRepository {
    TABLE_NAME = 'students';
    TABLE_SUBJECTS = 'subjects';
    TABLE_STUDENTS_SUBJECTS = 'students_subjects';
    SELECT = `SELECT * FROM ${this.TABLE_NAME}`;
    SELECT_BY_DOCUMENT = `${this.SELECT} WHERE document_number = ?`;
    INSERT = `INSERT INTO ${this.TABLE_NAME} (name, document_number, gender) VALUES (?, ?, ?)`;
    UPDATE = `UPDATE ${this.TABLE_NAME} SET name = ?, gender = ?, status = ? WHERE document_number = ?`;
    UPDATE_CREDITS = `UPDATE ${this.TABLE_NAME} SET credits = ? WHERE id_student = ?`;
    DELETE = `DELETE FROM ${this.TABLE_NAME} WHERE document_number = ?`;
    SELECT_CLASSMATES = `SELECT 
            sub.id_subject AS SubjectID,
            sub.name AS SubjectName,
            s2.name AS ClassmateName
        FROM ${this.TABLE_NAME} s1
        JOIN ${this.TABLE_STUDENTS_SUBJECTS} ss1 ON s1.id_student = ss1.id_student
        JOIN ${this.TABLE_STUDENTS_SUBJECTS} ss2 ON ss1.id_subject = ss2.id_subject
        JOIN ${this.TABLE_NAME} s2 ON ss2.id_student = s2.id_student
        JOIN ${this.TABLE_SUBJECTS} sub ON ss1.id_subject = sub.id_subject
        WHERE s1.document_number = ? 
        AND s2.id_student != s1.id_student 
        ORDER BY sub.id_subject, s2.name`;
    SELECT_DETAIL = `SELECT 
            s.name AS StudentName,
            s.document_number AS StudentDocumentNumber,
            s.gender AS StudentGender,
            s.status AS StudentStatus,
            s.credits AS StudentRemainingCredits,
            sub.id_subject AS SubjectID,
            sub.name AS SubjectName,
            sub.credit_cost AS Credits
        FROM ${this.TABLE_NAME} s
        JOIN ${this.TABLE_STUDENTS_SUBJECTS} ss ON s.id_student = ss.id_student
        JOIN ${this.TABLE_SUBJECTS} sub ON ss.id_subject = sub.id_subject
        WHERE s.document_number = ?`;

    constructor(connection) {
        this.connection = connection;
    };

    async getAll() {
        const [rows] = await this.connection.query(this.SELECT);
        return rows;
    };

    async getByDocument(document) {
        const [row] = await this.connection.query(this.SELECT_BY_DOCUMENT, [document]);
        return row;
    };

    async create(studentData) {
        const { name, documentNumber, gender } = studentData;
        const [result] = await this.connection.query(this.INSERT, [name, documentNumber, gender]);
        return { id: result.insertId, ...studentData };
    };

    async update(studentData) {
        const { name, documentNumber, gender, status } = studentData;
        await this.connection.query(this.UPDATE, [name, gender, status, documentNumber]);
        return { ...studentData };
    };

    async updateCredits(idStudent, credits) {
        await this.connection.query(this.UPDATE_CREDITS, [credits, idStudent]);
    };

    async delete(document) {
        await this.connection.query(this.DELETE, [document]);
    };

    async listClassmates(document) {
        const [result] = await this.connection.query(this.SELECT_CLASSMATES, [document]);
        return result;
    };

    async studentDetail(document) {
        const [result] = await this.connection.query(this.SELECT_DETAIL, [document]);
        return result;
    };
}

module.exports = StudentRepository;
