const db = require('../models/database');
const Question = db.question;
const Keyword = db.keyword;
const Relation = db.relations;

const createQuestion = async (req, res, next) => {
    const info = req.body;
    const newQ = await Question.create({ title: info.title, text: info.text, userUsername: req.username });
    const keywords = info.keywords.split(",");
    for (let keyword of keywords) {
        keyword = keyword.trim();
        const res = await Keyword.findByPk(keyword);
        if (!res){
            console.log('didnt find ' + keyword);
            await Keyword.create({name: keyword});
        }
        Relation.create({questionQId: newQ.qId, keywordName: keyword});
    }
    res.json(newQ);
}

const getQuestion = async (req, res, next) => {
    Question.findByPk(req.params['qid']).then(result => {
        res.json(result);
    })
}

const allQuestions = async (req, res, next) => {
    Question.findAll().then(result => {
        res.json(result);
    });
}

const usersQuestions = async (req, res, next) => {
    Question.findAll( { where: { userUsername: req.params['username']}}).then(result => {
        res.json(result);
    })
}

const controller = {};

controller.createQuestion = createQuestion;
controller.getQuestion = getQuestion;
controller.allQuestions = allQuestions;
controller.usersQuestions = usersQuestions;

module.exports = controller;