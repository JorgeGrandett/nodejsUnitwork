const jwt = require("jsonwebtoken");

const generateToken = () => {
    try {
        const token = jwt.sign( { auth: 'AdminAuth' }, process.env.SECRET_KEY);
        return token;
    } catch (error) {
        throw new Error(`Error al consultar la tasa de cambio: ${error.message}`);
    }
};

const validateToken = (tokenRaw) => {
    try {
        const token = tokenRaw.split(" ")[1];
        if (!token) {
            throw new Error("Token no propocionado");
        }
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        return payload.auth === 'AdminAuth';
    } catch (error) {
        throw new Error(`Error al validar el token: ${error.message}`);
    }
};

module.exports = { generateToken, validateToken };