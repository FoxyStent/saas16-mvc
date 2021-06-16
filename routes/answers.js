const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const userController = require('../controllers/userController');

/*
--- POST @ / => Adds new answer.
--- GET @ /user/:username => Returns answers of User with username = username
--- GET @ /question/:id => Returns answers of questions with qId = id
 */

router.post('/', userController.authorize, answerController.createAnswer);
router.get('/question/:id', answerController.questionsAnswers)
router.get('/user/:username', answerController.usersAnswers);

module.exports = router;
