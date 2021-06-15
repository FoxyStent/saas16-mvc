const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const userController = require('../controllers/userController');

/*
--- POST @ / => Adds new question.
--- GET @ /question/id => Returns question with qId = id
--- GET @ /questions => Returns all questions
 */

/* GET users listing. */
router.post('/', userController.authorize, questionController.createQuestion);

router.get('/questions', questionController.allQuestions);

router.get('/:qid', questionController.getQuestion);



module.exports = router;
