const express = require('express')
const router = express.Router();
const controller = require('./controller');
const {isLogged} = require("../../middlewares/auth");


router.get('/', controller.admin);

router.get('/getusers', controller.getUsers);
router.delete('/deleteuser', controller.deleteUser);
router.post('/editbalance', controller.editBalance);

router.post('/setsignal', controller.setSignal);
router.post('/editsignal', controller.editSignal);
router.get('/getsignal', controller.getSignal);
router.delete('/deletesignal/:id', controller.deleteSignal);

router.get('/getpost', controller.getPost);
router.post('/setpost', controller.setPost);
router.delete('/deletepost/:id', controller.deletePost);


module.exports = router;