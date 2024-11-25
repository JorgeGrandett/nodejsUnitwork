class StudentService {
    constructor(unitOfWork) {
        this.unitOfWork = unitOfWork;
    };

    async getAllStudents() {
        await this.unitOfWork.startTransaction();
        const students = await this.unitOfWork.studentRepository.getAll();
        await this.unitOfWork.commit();
        return students;
    };

    async getStudent(document) {
        await this.unitOfWork.startTransaction();
        const student = await this.unitOfWork.studentRepository.getByDocument(document);
        await this.unitOfWork.commit();
        return student;
    };

    async createStudent(studentData) {
        try {
            await this.unitOfWork.startTransaction();
            const student = await this.unitOfWork.studentRepository.create(studentData);
            await this.unitOfWork.commit();
            return student;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al crear estudiante: ${error.message}`);
        }
    };

    async updateStudent(studentData) {
        try {
            await this.unitOfWork.startTransaction();
            const student = await this.unitOfWork.studentRepository.update(studentData);
            await this.unitOfWork.commit();
            return student;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al editar estudiante: ${error.message}`);
        }
    };

    async deleteStudent(document) {
        try {
            await this.unitOfWork.startTransaction();
            await this.unitOfWork.studentRepository.delete(document);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al eliminar estudiante: ${error.message}`);
        }
    };

    async matriculateStudent(matriculationData) {
        try {
            const { studentDocumentNumber, idSubject} = matriculationData;

            await this.unitOfWork.startTransaction();

            const studentInfo = await this.validateStudent(studentDocumentNumber);
            if(studentInfo.credits == 0) throw new Error(`El estudiante no cuenta con créditos disponibles para matricular esta materia`); 
            
            const subjectInfo = await this.validateSubjectMatriculate(idSubject);

            const existPreviusRecord = await this.unitOfWork.studentsSubjectsRepository.validateExistingSubjects(studentInfo.id_student, subjectInfo.id_subject);
            if(existPreviusRecord && existPreviusRecord.existing_records > 0) throw new Error(`El estudiante ya tiene una materia matriculada con el profesor ${existPreviusRecord.teacher_name}`);

            await this.unitOfWork.studentsSubjectsRepository.matriculate(studentInfo.id_student, subjectInfo.id_subject);
            await this.unitOfWork.studentRepository.updateCredits(studentInfo.id_student, (studentInfo.credits - subjectInfo.credit_cost));

            await this.unitOfWork.commit();
            return {message: `Materia ${subjectInfo.name} matriculada con éxito`};
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al matricular materia: ${error.message}`);
        }
    };

    async subjectCancelStudent(cancelData) {
        try {
            const { studentDocumentNumber, idSubject} = cancelData;

            await this.unitOfWork.startTransaction();

            const studentInfo = await this.validateStudent(studentDocumentNumber);
            
            const subjectInfo = await this.validateSubjectMatriculate(idSubject);

            await this.unitOfWork.studentsSubjectsRepository.cancelSubject(studentInfo.id_student, subjectInfo.id_subject);
            await this.unitOfWork.studentRepository.updateCredits(studentInfo.id_student, (studentInfo.credits + subjectInfo.credit_cost));

            await this.unitOfWork.commit();
            return {message: `Materia ${subjectInfo.name} cancelada con éxito`};
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al cancelar materia matriculada: ${error.message}`);
        }
    };

    async validateStudent(studentDocumentNumber){
        let studentInfo = await this.unitOfWork.studentRepository.getByDocument(studentDocumentNumber);
        if(!studentInfo || studentInfo.length == 0) throw new Error(`Estudiante no registrado`);
        studentInfo = studentInfo[0];
        if(studentInfo.status == 0) throw new Error(`El estudiante se encuentra inhablitado`);
        return studentInfo;
    };

    async validateSubjectMatriculate(idSubject) {
        let subjectInfo = await this.unitOfWork.subjectRepository.getById(idSubject);
        if(!subjectInfo || subjectInfo.length == 0) throw new Error(`Materia no registrada`);
        return subjectInfo[0];
    };

    async classmatesList(document) {
        try {
            await this.unitOfWork.startTransaction();

            await this.validateStudent(document);
            
            const list = await this.unitOfWork.studentRepository.listClassmates(document);
            await this.unitOfWork.commit();
            return this.formatClassmates(list);
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al cancelar materia matriculada: ${error.message}`);
        }
    };

    formatClassmates(list) {
        const formattedResponse = list.reduce((acc, record) => {
            const { SubjectID, SubjectName, ClassmateName } = record;
          
            let subject = acc.find(s => s.SubjectID === SubjectID);
          
            if (!subject) {
              subject = {
                SubjectID,
                SubjectName,
                Classmates: []
              };
              acc.push(subject);
            }
          
            if (!subject.Classmates.includes(ClassmateName)) {
              subject.Classmates.push(ClassmateName);
            }
          
            return acc;
        }, []);
        return formattedResponse;
    };

    async studentDetail(document, exchangeRate) {
        try {
            await this.unitOfWork.startTransaction();

            await this.validateStudent(document);
            
            const data = await this.unitOfWork.studentRepository.studentDetail(document);
            await this.unitOfWork.commit();
            return await this.formatStudentDetail(data, exchangeRate);
        } catch (error) {
            await this.unitOfWork.rollback();
            throw new Error(`Error al general el detalle del estudiante: ${error.message}`);
        }
    };

    async formatStudentDetail(data, exchangeRate) {
        // const exchangeRate = await this.getExchangeRate();
        
        const formattedResponse = {
            'Nombre': data[0].StudentName,
            'Numero de documento': data[0].StudentDocumentNumber,
            'Genero': data[0].StudentGender,
            'Estado': data[0].StudentStatus == 1 ? 'Activo' : 'Inactivo',
            'Creditos Restantes': data[0].StudentRemainingCredits,
            'Materias': data.map(subject => {
                const usdCost = subject.Credits * 150;
                const eurCost = (usdCost * exchangeRate).toFixed(2);
                return {
                    'Id Materia': subject.SubjectID,
                    'Nombre Materia': subject.SubjectName,
                    'Costo en Creditos': subject.Credits,
                    'Costo Dólares (USD)': usdCost.toFixed(2),
                    'Costo Euros (EUR)': eurCost
                };
            })
        };
        
        return formattedResponse;
    };

    async getExchangeRate() {
        try {
            const response = await axios.get(process.env.FRANKFURTER_URL);
            const rates = response.data.rates;
            return rates.USD;
        } catch (error) {
            throw new Error(`Error al consultar la tasa de cambio: ${error.message}`);
        }
    };
}


module.exports = StudentService;
