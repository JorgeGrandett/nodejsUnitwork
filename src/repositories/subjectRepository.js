class SubjectRepository {
    TABLE_NAME = 'subjects';
    SELECT = `SELECT * FROM ${this.TABLE_NAME}`;
    SELECT_BY_NAME = `${this.SELECT} WHERE name LIKE ?`;
    SELECT_BY_ID = `${this.SELECT} WHERE id_subject = ?`;
    INSERT = `INSERT INTO ${this.TABLE_NAME} (name, id_teacher) VALUES (?, ?)`;
    UPDATE = `UPDATE ${this.TABLE_NAME} SET name = ?, id_teacher = ?, status = ? WHERE id_subject = ?`;
    DELETE = `DELETE FROM ${this.TABLE_NAME} WHERE id_subject = ?`;

    constructor(connection) {
        this.connection = connection;
    };

    async getAll() {
        const [rows] = await this.connection.query(this.SELECT);
        return rows;
    };

    async getByName(name) {
        const searchName = `%${name}%`;
        const [row] = await this.connection.query(this.SELECT_BY_NAME, [searchName]);
        return row;
    };

    async getById(id) {
        const [row] = await this.connection.query(this.SELECT_BY_ID, [id]);
        return row;
    };

    async create(subjectData) {
        const { name, idTeacher } = subjectData;
        const [result] = await this.connection.query(this.INSERT, [name, idTeacher]);
        return { id: result.insertId, ...subjectData };
    };

    async update(subjectData) {
        const { idSubject, name, idTeacher, status } = subjectData;
        await this.connection.query(this.UPDATE, [name, idTeacher, status, idSubject]);
        return { ...subjectData };
    };

    async delete(id) {
        await this.connection.query(this.DELETE, [id]);
    };
}

module.exports = SubjectRepository;
