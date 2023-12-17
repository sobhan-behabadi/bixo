const controller = require('./../controller');
const mongoose = require("mongoose");
const axios = require('axios')
const ZarinpalCheckout = require('zarinpal-checkout');
const bcrypt = require("bcrypt");

module.exports = new (class extends controller {

    async dashboard(req, res) {

        const {name, email, isAdmin, balance, _id} = req.user;
        return this.response({
            res,
            data: {name, email, balance, isAdmin, _id},
            message: 'مشخصات یوزر'
        })
    }

    async buySignal(req, res) {

        const {id_signal} = req.body;
        const {id: id_user} = req.user;

        let validIdSignal = mongoose.Types.ObjectId.isValid(id_signal);
        let validIdUser = mongoose.Types.ObjectId.isValid(id_user);

        if (!validIdSignal || !validIdUser) {
            return this.response({
                res,
                message: 'باید ایدی کاربر و سیگنال معتبر باشد  باشد ',
                code: 406
            })
        }

        if (!id_signal || !id_user) {
            return this.response({
                res,
                message: 'باید ایدی کاربر و سیگنال وجود داشته باشد ',
                code: 406
            })
        }


        let signal = await this.Signal.findById(id_signal);
        let user = await this.User.findById(id_user);


        if (!signal) {
            return this.response({
                res,
                message: 'این سیگنال وجود ندارد ',
                code: 406
            })
        }

        if (!user) {
            return this.response({
                res,
                message: 'این کاربر وجود ندارد ',
                code: 406
            })
        }

        if (user.balance < signal.price) {
            return this.response({
                res,
                message: 'You can\'t get the signal, you dont have enough balance',
                code: 406
            })
        }

        let ss = user.signal.find(function (e) {
            return e.toString() === signal._id.toString()
        });

        if (ss)
            return this.response({
                res,
                message: 'Already purchased',
                code: 406
            })

        if (user.balance >= signal.price) {

            user.balance = user.balance - signal.price;
            await user.save();


            await this.User.updateOne({_id: id_user}, {$push: {signal: signal._id}})

            // console.log(user);
            return this.response({
                res,
                message: 'success, The signal was purchased',
                data: {
                    newSignal: signal,
                    allSignal: user.signal,
                }
            })
        }


    }

    async getPost(req, res) {

        let post = await this.Post.find({}).sort({createdAt: -1});

        return this.response({
            res,
            message: 'همه پست ها',
            data: post
        })
    }

    async showSignal(req, res) {

        let signals = await this.Signal.find({});

        let showNameSignal = [];
        signals.map((i) => {
            showNameSignal.push({id: i._id, symbol: i.symbol, price: i.price, time: i.time, deActive: i.deActive})
        })

        return this.response({
            res,
            message: 'لیست سیگنال ها برای خرید',
            data: showNameSignal.reverse()
        })

    }

    async getSignal(req, res) {

        const {id} = req.user;

        let validIdUser = mongoose.Types.ObjectId.isValid(id);

        if (!validIdUser) {
            return this.response({
                res,
                message: 'باید ایدی یوزر معتبر باشد ',
                code: 406
            })
        }

        if (!id) {
            return this.response({
                res,
                message: 'ایدی باید وجود داشته باشد',
                code: 406
            })
        }

        let user = await this.User.findById(id);

        if (!user) {
            return this.response({
                res,
                message: 'این یوزر وجود ندارد',
                code: 406
            })
        }

        let userSignals = [];

        for (const i of user.signal) {
            let sg = await this.Signal.findById(i)
            userSignals.push(sg);
        }

        userSignals = userSignals.filter((i) => i);

        return this.response({
            res,
            message: 'همه سیگنال های کاربر ',
            data: userSignals.reverse()
        })

    }

    async addBalance(req, res) {


        const {id} = req.user;
        const {addBalance} = req.body;

        if (!id || !addBalance) {
            this.response({
                message: 'Error, You should send Id user and Addbalance amount',
                code: 406,
            })
        }

        // const zarinpal = ZarinpalCheckout.create('0e7a6a3b-34ef-4bc6-aaf5-dee6ca82560e', true);
        //
        // zarinpal.PaymentRequest({
        //     Amount: addBalance, // In Tomans
        //     CallbackURL: 'http://localhost:3000/dashboard',
        //     Description: 'Charged',
        //     Email: 'sobhan@gmail.com',
        //     Mobile: '09357449861',
        // }).then(async response => {
        //     console.log('response : ', response)
        //     if (response.status === 100) {
        //         // // console.log(response.url);
        //         // // console.log(response);
        //         // let newPayment = new this.Payment({
        //         //     user: id,
        //         //     amount: addBalance,
        //         //     resNumber: response.authority,
        //         // })
        //         // await newPayment.save();
        //         res.redirect(response.url);
        //
        //     }
        // }).catch(err => {
        //     console.error('err: ', err);
        // });

        let user = await this.User.findById(id);
        await this.User.findByIdAndUpdate(id, {$set: {balance: addBalance}});
        user.save()
        return this.response({
            res,
            message: 'با موفقیت شارز شد!',
            data: addBalance
        })


        // const apiUrl = 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json';
        // let params = {
        //     merchantId: '0e7a6a3b-34ef-4bc6-aaf5-dee6ca82560e',
        //     amount: addBalance,
        //     description: 'Add Balance',
        //     callbackUrl: 'https://google.com',
        // }
        //
        // try {
        //     const response = await axios.post(apiUrl, params);
        //     console.log(response)
        //     if (response.data.Status === 100) {
        //         let newPayment = new this.Payment({
        //             user: id,
        //             amount: params.amount,
        //             resNumber: response.data.Authority,
        //         })
        //         await newPayment.save();
        //         res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.data.Authority}`);
        //
        //         // return this.response({
        //         //     res,
        //         //     message: 'ok',
        //         //     code: 200
        //         // })
        //     } else {
        //         return this.response({
        //             res,
        //             message: 'Error',
        //             code: 400
        //         })
        //     }
        //
        // } catch (e) {
        //     console.log('error', e)
        //     res.send('error')
        // }

        // axios.post(apiUrl, requestData)
        //     .then(response => {
        //         const paymentUrl = response.data.url;
        //         console.log('URL: ' + paymentUrl);
        //
        //         // ذخیره اطلاعات تراکنش در MongoDB
        //         const transactionData = {
        //             merchantId: merchantId,
        //             amount: amount,
        //             description: description,
        //             callbackUrl: callbackUrl,
        //             paymentUrl: paymentUrl,
        //         };
        //
        //     })
        //     .catch(error => {
        //         console.error('Error:', error.response.data);
        //     });


        // try {
        //
        //     let params = {
        //         MerchantID: "6cded376-3063-11e9-a98e-005056a205be",
        //         Amount: req.body.amount,
        //         CallbackURL: "http://localhost:3000/",
        //         Description: "افزایش اعتبار حساب کاربری ",
        //     }
        //     const response = await axios.post("https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json", params);
        //     console.log(response);
        //     if (response.data.Status === 100) {
        //         let newPayment = new this.Payment({
        //             user: req.user.id,
        //             amount: req.body.amount,
        //             resNumber: response.data.Authority
        //         })
        //         await newPayment.save();
        //         res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.data.Authority}`);
        //     } else res.redirect('http://localhost:3000/dashboard')
        //
        // } catch (e) {
        //     return this.response({
        //         code: 400,
        //         message: 'پرداخت تاموفق',
        //         data: e
        //     })
        // }

    }

    async editProfile(req, res) {

        const {id} = req.user;
        const {password} = req.body;
        if (!password) {
            return this.response({
                res,
                message: 'Password is Empty',
                code: 406,
            })
        }

        let user = await this.User.findById(id);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        return this.response({
            res,
            message: 'Password Changed'
        })

    }


})();
