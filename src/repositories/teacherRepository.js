class TeacherRepository {
    TABLE_NAME = 'teachers';
    SELECT = `SELECT * FROM ${this.TABLE_NAME}`;
    SELECT_BY_DOCUMENT = `${this.SELECT} WHERE document_number = ?`;
    INSERT = `INSERT INTO ${this.TABLE_NAME} (name, document_number, gender) VALUES (?, ?, ?)`;
    UPDATE = `UPDATE ${this.TABLE_NAME} SET name = ?, gender = ?, status = ? WHERE document_number = ?`;
    DELETE = `DELETE FROM ${this.TABLE_NAME} WHERE document_number = ?`;
    CALL_SP_GET_TEACHERS_AND_STUDENTS = `CALL GetTeachersAndStudents()`;

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

    async delete(document) {
        await this.connection.query(this.DELETE, [document]);
    };

    async getAllTeachersStudentsPerSubjet() {
        const [[rows]] = await this.connection.query(this.CALL_SP_GET_TEACHERS_AND_STUDENTS);
        return rows; 
    };

}

module.exports = TeacherRepository;
