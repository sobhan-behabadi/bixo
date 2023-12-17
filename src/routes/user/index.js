const express = require('express')
const router = express.Router();
const controller = require('./controller');
const {isLogged} = require("../../middlewares/auth");


/**
 * @swagger
 * host: localhost:2000
 * basePath: /api
 * schemes:
 *   - http
 *   - https
 * tags:
 *   - name: User
 *     description: Information about the user
 * paths:
 *   /user:
 *     get:
 *       summary: Get user information
 *       description: Dashboard
 *       parameters:
 *         - name: x-auth-token
 *           in: header
 *           description: The authentication token
 *           required: true
 *           type: string
 *       responses:
 *         200:
 *           description: Returns info Dashboard.
 *         401:
 *           description: Unauthorized - Token is missing or invalid.
 */

router.get('/', controller.dashboard);
router.post('/addbalance', controller.addBalance);
router.get('/getsignal', controller.getSignal);
router.get('/showsignal', controller.showSignal);
router.post('/buysignal', controller.buySignal);
router.get('/getpost', controller.getPost);
router.post('/editprofile', controller.editProfile);


module.exports = router;