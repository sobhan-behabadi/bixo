const winston = require('winston');



module.exports = (err, req, res, next) => {
    winston.error(err.message, err);
    res.status(500).json({
        code: 500,
        message: 'ارور سمت سرور'
    })
}
