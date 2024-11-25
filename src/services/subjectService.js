class SubjectService {
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork;
    };

    async getAllSubjects() {
        await this.unitOfWork.startTransaction();
        const subjects = await this.unitOfWork.subjectRepository.getAll();
        await this.unitOfWork.commit();
        return subjects;
    };

    async getSubject(name) {
        await this.unitOfWork.startTransaction();
        const subject = await this.unitOfWork.subjectRepository.getByName(name);
        await this.unitOfWork.commit();
        return subject;
    };

    async createSubject(subjectData) {
        try {
            await this.unitOfWork.startTransaction();
            const subject = await this.unitOfWork.subjectRepository.create(subjectData);
            await this.unitOfWork.commit();
            return subject;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al crear materia: ${error.message}`);
        }
    };

    async updateSubject(subjectData) {
        try {
            await this.unitOfWork.startTransaction();
            const subject = await this.unitOfWork.subjectRepository.update(subjectData);
            await this.unitOfWork.commit();
            return subject;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al editar materia: ${error.message}`);
        }
    };

    async deleteSubject(id) {
        try {
            await this.unitOfWork.startTransaction();
            await this.unitOfWork.subjectRepository.delete(id);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al eliminar materia: ${error.message}`);
        }
    };
}

module.exports = SubjectService;
