const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const userController = require('../controllers/userController');

/*
--- POST @ / => Adds new question.
--- GET @ /question/id => Returns question with qId = id
--- GET @ /questions => Returns all questions
--- GET @ /keyword/:keyword => Returns all questions with keyword in keywords
 */

/* GET users listing. */
router.post('/', userController.authorize, questionController.createQuestion);

router.get('/keyword/:keyword', questionController.keywordsQuestions);

router.get('/all/:offset', userController.isLogged, questionController.moreQuestions);
router.get('/all', userController.isLogged, questionController.allQuestions);

router.get('/:qid', userController.isLogged, questionController.getQuestion);

router.get('/title/:tit', questionController.titleQuestions);





module.exports = router;
