const expressValidator = require('express-validator');

const check = expressValidator.check;


module.exports = new class {

    registerValidator() {
        return [
            check('email')
                .isEmail()
                .withMessage('فرمت ایمیل صحیح نیست'),
            check('name')
                .not()
                .isEmpty()
                .withMessage('نام نمیتواند خالی باشد'),
            check('password')
                .not()
                .isEmpty()
                .withMessage('پسوورد نمیتواند خالی باشد'),
        ]
    }

    loginValidator() {
        return [
            check('email')
                .isEmail()
                .withMessage('فرمت ایمیل صحیح نیست'),
            check('password')
                .not()
                .isEmpty()
                .withMessage('پسوورد نمیتواند خالی باشد'),

        ]

    }

}


