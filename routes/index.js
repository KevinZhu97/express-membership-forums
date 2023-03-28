var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController')
var messageController = require('../controllers/messageController')
const passport = require("passport");

/* GET home page. */
router.get('/', indexController.login_get)
router.post('/', indexController.login_post)
router.get('/log-out', indexController.logout_get)

router.get('/sign_up', indexController.sign_up_page_get)
router.post('/sign_up', indexController.sign_up_page_post)

router.get('/access', indexController.access_get)
router.post('/access', indexController.access_post)

router.get('/create_message', messageController.create_message_get)
router.post('/create_message', messageController.create_message_post)

module.exports = router;
