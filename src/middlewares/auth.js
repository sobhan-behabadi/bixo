const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./../models/user');

async function isLogged(req, res, next) {

    const token = req.header("x-auth-token"); // byd front end dar request ha az in kilid estefade kone va token ro bargardone be server ta server betoone decode kone

    if (!token) {
        return res.status(401).send({
            code: 401,
            message: 'دسترسی ممنوع شده',
            data: {}
        });
    }


    // if (token === 'test') {
    //     return res.status(200).send({
    //         code: 200,
    //         message: 'توکن تست است',
    //         data: {}
    //     })
    // }

    try {
        const decoded = jwt.verify(token, config.get('jwt_key')); // inja ma oon tokeni ke az samte front ersal shode ro decode mikonim
        const user = await User.findById(decoded._id);
        // console.log(user);
        req.user = user;
        next();

    } catch (ex) {
        return res.status(400).send({
            code: 400,
            message: 'توکن نامعتبر',
            data: {}
        })
    }


}


function isAdmin(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(403).send({
            code: 403,
            message: 'دسترسی ممنوع شده - باید ادمین باشید',
            data: {}
        })
    }
    next();

}


module.exports = {
    isLogged,
    isAdmin
}