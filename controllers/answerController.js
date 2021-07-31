const db = require('../models/database')
const sequelize = db.sequelize
const createError = require("http-errors");
const Answer = db.answer;
const Question = db.question;
const User = db.user;

const createAnswer = async (req, res, next) => {
    const info = req.body;
    Answer.create({questionQId: info.qid, text: info.text, userUsername: req.username}).then(response => {
        res.json(response);
        console.log('ok');
    }).catch(e => {
        console.log(e);
        next(createError(e));
    })
}

const questionsAnswers = async (req, res, next) => {
    const info = req.params;
    Answer.findAll({where: { questionQId: info.id }}).then(response => {
        res.json(response);
        console.log('ok');
    }).catch(e => {
        console.log(e);
        next(createError(e));
    })
}

const usersAnswers = async (req, res, next) => {
    const info = req.params;
    Answer.findAll({ where: { userUsername: info.username }}).then(response => {
        res.json(response);
        console.log('ok');
    }).catch(e => {
        console.log(e);
        next(createError(e));
    })
}

const userAnswersContribution = async (req, res, next) => {
    res.locals.answerContribution = await Answer.count({
        attributes: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'date']],
        where: {
            userUsername: req.username,
        },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
    });
    return next();
}

const controller = {};

controller.createAnswer = createAnswer;
controller.questionsAnswers = questionsAnswers;
controller.usersAnswers = usersAnswers;
controller.userAnswersContribution = userAnswersContribution;

module.exports = controller;