const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*
--- POST @ / => Adds new user.
--- GET @ /username/answers => Returns all answers of user 'username'
--- GET @ /username/profile => Returns users 'username' profile
--- GET @ /username/questions => Returns all questions of user 'username'
--- POST @ /login => User login
--- POST @ /logout => Logouts/Invalidates Users JWT
 */

router.post('/', userController.createUser);
router.get('/profile', userController.authorize, userController.profile);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);


module.exports = router;
