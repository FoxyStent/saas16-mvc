const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');

/*
--- POST @ / => Adds new user.
--- GET @ /username/answers => Returns all answers of user 'username'
--- GET @ /username/profile => Returns users 'username' profile
--- GET @ /username/questions => Returns all questions of user 'username'
--- POST @ /login => User login
--- POST @ /logout => Logouts/Invalidates Users JWT
 */

router.get('/:username/profile', userController.authorize, userController.profile);
router.get('/:username/questions', userController.authorize, questionController.usersQuestions)
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.post('/', userController.createUser);


module.exports = router;
