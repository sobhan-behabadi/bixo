const controller = require('./../controller');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = new (class extends controller {

    async register(req, res) {
        // chek mikonim ke aya hamchin karbari qablan sabte nam karde ya na
        //agar karde peyqam error ersal konim
        let user = await this.User.findOne({email: req.body.email}); //aval az hame tamame field ha e user ro mirizim dakhele yek moteqayer hala roo moteqayer kar ha ro mikonim.

        if (user) {
            return this.response({
                res,
                message: 'این کاربر وجود دارد',
                code: 400
            })
        }
        // sabte name karbar ba movafaqiat anjam mishe
        // user = new this.User(_.pick(req.body,['name', 'email', 'password']));
        const {email, name, password} = req.body;
        user = new this.User({email, name, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        return this.response({
            res,
            message: 'عضویت با موفقیت انجام شد',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }

    async login(req, res) {

        let user = await this.User.findOne({email: req.body.email}); // aval ba emaili ke karbar vared karde, be tamame moshakhaste oon karbar dar database dast peyda mikonim
        // chek mikonim bbinim aslan hamchin useri vojod dare ya na ?!
        if (!user) {
            return this.response({
                res,
                message: 'کاربری با این ایمیل یافت نشد',
                code: 400
            })
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            return this.response({
                res,
                message: 'ایمیل یا پسوورد اشتباه است',
                code: 400
            })
        }

        const token = jwt.sign({_id: user.id}, config.get('jwt_key'));

        return this.response({
            res,
            message: 'با موفقیت وارد شدید',
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                signal: user.signal,
                isAdmin: user.isAdmin,
                balance: user.balance,
                token
            }
        })

    }


})();
