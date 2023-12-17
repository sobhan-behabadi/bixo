const autoBind = require('auto-bind');
const {validationResult} = require('express-validator');
const User = require('./../models/user');
const Payment = require('./../models/payment');
const Signal = require('./../models/signal');
const Post = require('./../models/post');


module.exports = class {

    constructor() {
        autoBind(this);
        this.Post = Post;
        this.User = User;
        this.Payment = Payment;
        this.Signal = Signal;

    }

    validationBody(req, res) {
        // dar inja ma chek mikonim ke dar file ha e validator ha e har pooshe aya error validation darim ya na!
        // ke asle kar ra tabe  validate anjam midahad
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            const message = [];
            errors.forEach(err => message.push(err.msg));
            res.status(400).json({
                message: 'ارور اعتبار سنجی',
                data: message
            })
            return false;
        }
        return true;
    }

    validate(req, res, next) {
        //agar tabe validationBody false bood (yani error dashtim) pas haminja motevaqef she va dg nare cod eha e dg ejra she.
        if (!this.validationBody(req, res)) {
            return;
        }
        // agar tru bood function bala yani error nadashtim pas baqie code ha ejra she
        next();
    }

    response({res, message, code = 200, data = {}}) {
        res.status(code).json({
            message,
            data,
            code
        })
    }

}