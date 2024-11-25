const { validateToken } = require('../utils/token');

const accessAuth = () => {
    return (req, res, next) => {

        if(req.headers.authorization && validateToken(req.headers.authorization)) return next();

        return res.status(401).json({ errors: 'No tiene permisos para acceder a este recurso' });
    };
};

module.exports = accessAuth;