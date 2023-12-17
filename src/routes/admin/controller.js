const controller = require('./../controller');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");


module.exports = new (class extends controller {

        async admin(req, res) {
            const {name, email} = req.user;
            return this.response({
                res,
                data: {name, email},
                message: 'مشخصات یوزر'
            })
        }

        // async admin(req, res) {
        //     res.send('dashboard admin')
        // }

        async getUsers(req, res) {
            let users = await this.User.find({});
            return this.response({
                res,
                message: 'همه یوزر ها',
                data: users
            })
        }

        async deleteUser(req, res) {

            let {email} = req.body;

            if (!email) {
                return this.response({
                    res,
                    message: 'ایمیل باید وجود داشته باشد',
                    code: 406
                })
            }

            let user = await this.User.findOne({email});
            if (!user) {
                return this.response({
                    res,
                    message: 'چنین یوزری وجود ندارد',
                    code: 404
                })
            }
            await this.User.deleteOne({email});
            return this.response({
                res,
                message: 'کاربر با موفقیت حذف شد',
            })
        }


        async getSignal(req, res) {

            const signals = await this.Signal.find({});

            return this.response({
                res,
                message: 'همه سیگنال ها',
                data: signals
            })
        }

        async editSignal(req, res) {

            const {_id, symbol, action, time, price} = req.body;
            let {target, stop, deActive} = req.body;

            function isEmpty(value) {
                return value === undefined || value === null || value === '';
            }

            if (!_id || !symbol || !action || !time || !target || !price || !stop || isEmpty(deActive)) {
                return this.response({
                    res,
                    message: 'باید (سیمبول - اکشن - تایم - تارگت - استاپ - پرایس، دی اکتیو ) مشخص باشد',
                    code: 406
                })
            }

            target = target.replace(/'/g, '').split(',').map(Number);
            stop = stop.replace(/'/g, '').split(',').map(Number);
            if (deActive == 'true') deActive = true;
            if (deActive == 'false') deActive = false;

            await this.Signal.updateMany({_id}, {$set: {symbol, action, time, target, price, stop, deActive}});

            return this.response({
                res,
                message: `سیگنال ${symbol} با موفقیت آپدیت شد`,
            })


        }

        async setSignal(req, res) {


            let {symbol, action, time, target, price, stop} = req.body;
            if (!symbol || !action || !time || !target || !price || !stop) {
                return this.response({
                    res,
                    message: 'باید (سیمبول - اکشن - تایم - تارگت - استاپ - پرایس ) مشخص باشد',
                    code: 406
                })
            }


            target = target.replace(/'/g, '').split(',').map(Number);
            stop = stop.replace(/'/g, '').split(',').map(Number);

            let signal = new this.Signal({symbol, action, time, target, price, stop});
            await signal.save();
            return this.response({
                res,
                message: 'سیگنال با موفقیت ثبت شد',
                data: signal
            })
        }

        async deleteSignal(req, res) {

            const {id} = req.params;
            const {deActive} = req.body;

            if (!id) {
                return this.response({
                    res,
                    message: 'ایدی باید وجود داشته باشد',
                    code: 406
                })
            }

            let signal = await this.Signal.findById(id);

            if (!signal) {
                return this.response({
                    res,
                    message: 'همچین سیگنالی وجود نداشته است',
                    code: 406
                })
            }

            if (deActive === true) {

                signal.deActive = true;
                await signal.save();
                return this.response({
                    res,
                    message: 'success, deActive = true',
                    data: signal
                })
            }

            if (deActive === false) {
                signal.deActive = false;
                await signal.save();
                return this.response({
                    res,
                    message: 'success, deActive = false',
                    data: signal
                })
            } else {
                return this.response({
                    res,
                    message: 'Invalid Body, Body just true or Fasle',
                })
            }

            // await this.Signal.deleteOne(signal);


        }

        async getPost(req, res) {

            const posts = await this.Post.find({});

            return this.response({
                res,
                message: 'همه پست ها',
                data: posts
            })

        }

        async setPost(req, res) {

            const {title, text, link, image} = req.body;

            if (!title || !text) {
                return this.response({
                    res,
                    message: 'عنوان و متن نباید خالی باشد',
                    code: 406
                })
            }

            const post = new this.Post({title, text, link, image});
            await post.save();

            return this.response({
                res,
                message: 'پست با موفقیت اضافه شد',
                data: post
            })

        }

        async deletePost(req, res) {

            const {id} = req.params;
            let validIdPost = mongoose.Types.ObjectId.isValid(id);
            if (!id) {
                return this.response({
                    res,
                    message: 'باید آیدی وجود داشته باشد',
                    code: 406,
                })
            }
            if (!validIdPost) {
                return this.response({
                    res,
                    message: 'آیدی اشتباه است',
                    code: 406
                })
            }

            let post = await this.Post.findById(id);

            if (!post) {
                return this.response({
                    res,
                    message: 'همچین پستی وجود ندارد وجود نداشته است',
                    code: 406
                })
            }

            await this.Post.deleteOne(post);
            return this.response({
                res,
                message: 'پست با موفقت پاک شد',
                data: post
            })

        }

        async editBalance(req, res) {
            const {id, balance, action} = req.body;
            if (id || balance || action) {
                if (action === 10 || action === 20 || action === 30) {

                    let messageAction = ''
                    if (action === 10) {
                        messageAction = 'صفر کردن موجودی انجام شد'
                    }
                    if (action === 20) {
                        messageAction = 'موجودی با موفقیت افزایش یافت'
                    }
                    if (action === 30) {
                        messageAction = 'موجودی با موفقیت کاهش یافت'
                    }

                    let user = await this.User.findById(id);

                    if (action === 10) {
                        user.balance = 0;
                        await user.save();
                    }
                    if (action === 20) {
                        user.balance += balance;
                        await user.save();
                    }
                    if (action === 30) {
                        user.balance -= balance;
                        await user.save();
                    }

                    return this.response({
                        res,
                        message: 'موجودی کاربر با موفقیت تغییر یافت',
                        data: {
                            edit: messageAction,
                            newBalance: user.balance,
                        }

                    })

                }
            }
            return this.response({
                res,
                message: 'باید ایدی کاربر و اکشن و موجودی حتما وجود داشته باشد action : 10=remove All Balance , 20=IncrementBalance , 30=DecrementBalance  ',
                code: 406
            })
        }


    }

)()
;
