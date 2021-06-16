const db = require('../models/database');
const Question = db.question;
const Keyword = db.keyword;
const Relation = db.relations;
const Answer = db.answer;

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
    const result = await Question.findByPk(req.params['qid'], {include: [{model: Relation, attributes: ['keywordName']}, {model: Answer}]})
    const keywords = []
    for (rel of result.relations){
        keywords.push(rel.keywordName);
    }
    const data = {
        isLogged: res.locals.logged,
        title: result.title,
        text: result.text,
        createdAt: result.createdAt,
        username: result.userUsername,
        keywords: keywords,
        answers: result.answers,
    }
    res.render('question', data);
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

const keywordsQuestions = async (req, res, next) => {
    const relations = await Relation.findAll({ where: { keywordName: req.params['keyword']}});
    const questions = [];
    for (let rel of relations){
        questions.push(await Question.findByPk(rel.questionQId));
    }
    res.json(questions);
}

const controller = {};

controller.createQuestion = createQuestion;
controller.getQuestion = getQuestion;
controller.allQuestions = allQuestions;
controller.usersQuestions = usersQuestions;
controller.keywordsQuestions = keywordsQuestions;

module.exports = controller;