const express = require('express');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const subjectRoutes = require('./routes/subject');
const getExchangeRate = require('./utils/getExchangeRate');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/subject', subjectRoutes);

app.get('/health', (req, res) => {
    res.send('Server OK').status(200);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});

getExchangeRate().then((data) => {
    app.set('exchangeRate', data);
    console.log("Tasa de cambio USD => EUR:", data);
}).catch((error) => {
    app.set('exchangeRate', 1);
    console.log('Error al consultar tasa de cambio:', error.message);
});