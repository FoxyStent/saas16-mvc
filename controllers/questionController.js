const db = require('../models/database');
const Question = db.question;
const Keyword = db.keyword;
const Relation = db.relations;
const Answer = db.answer;
const sequelize = require('sequelize');

const createQuestion = async (req, res, next) => {
    const info = req.body;
    const newQ = await Question.create({ title: info.title, text: info.text, userUsername: req.username });
    const keywords = info.keywords.split(",");
    for (let keyword of keywords) {
        keyword = keyword.trim();
        const res = await Keyword.findByPk(keyword);
        if (!res){
            await Keyword.create({name: keyword});
        }
        Relation.create({questionQId: newQ.qId, keywordName: keyword});
    }
    res.json(newQ);
}

const getQuestion = async (req, res, next) => {
    const result = await Question.findByPk(req.params['qid'], {include: [{model: Relation, attributes: ['keywordName']}, {model: Answer}]});
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
    Question.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']]
    }).then(result => {
        res.render('all', {data: result, answers: false, isLogged: res.locals.logged, forUser: false});
    });
}

const moreQuestions = async (req, res, next) => {
    const off = parseInt(req.params['offset']);
    Question.findAll({
        offset: off,
        limit: 10,
        order: [['createdAt', 'DESC']]
    }).then(result => {
        res.json(result);
    });
}

const usersQuestions = async (req, res, next) => {
    Question.findAll( {
        where: { userUsername: req.params['username']},
        limit: 10,
        order: [['createdAt', 'DESC']],
    }).then(result => {
        res.render('all', {data: result, answers: false, isLogged: res.locals.logged, forUser: true});
    })
}

const moreUsersQuestions = async (req, res, next) => {
    const off = parseInt(req.params['offset']);
    Question.findAll({
        where: { userUsername: req.params['username']},
        offset: off,
        limit: 10,
        order: [['createdAt', 'DESC']]
    }).then(result => {
        res.json(result);
    });
}



const keywordsQuestions = async (req, res, next) => {
    const relations = await Relation.findAll({ where: { keywordName: req.params['keyword']}});
    const questions = [];
    for (let rel of relations){
        questions.push(await Question.findByPk(rel.questionQId));
    }
    res.json(questions);
}

const perWeek = async (req, res, next) => {
    const limit = new Date(new Date().setDate(new Date().getDate() - 7));
    const relations = await Relation.count({
        attributes: ['keywordName'],
        where: {
            createdAt: {
                [sequelize.Op.gt]: limit
            }
        },
        group: 'keywordName',
        order: [['count', 'DESC']],
        limit: 2
    })
    const questions = await Question.count({
        attributes: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'date']],
        where: {
            createdAt: {
                [sequelize.Op.gt]: limit
            }
        },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [['count', 'ASC']]
    })
    console.log(questions);
    const final_questions = []
    let weekday=new Array(7);
    weekday[1]="Monday";
    weekday[2]="Tuesday";
    weekday[3]="Wednesday";
    weekday[4]="Thursday";
    weekday[5]="Friday";
    weekday[6]="Saturday";
    weekday[0]="Sunday";
    let x=1;
    for (i=0; i<7; i++){
        let q = questions[questions.length - x];
        if (q) {
            console.log(new Date(q.date).getDate(), new Date(new Date().setDate(new Date().getDate() - i)).getDate())
            if (new Date(q.date).getDate() === new Date(new Date().setDate(new Date().getDate() - i)).getDate()) {
                x++;
                console.log(new Date(new Date().setDate(new Date().getDate() - i)))
                let newDate = new Date(q.date).getDate();
                final_questions.push({
                    day: new Date(q.date).toLocaleDateString('en-GB', {weekday: 'long'}),
                    count: q['count']
                })
            } else {
                final_questions.push({
                    day: new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString('en-GB', {weekday: 'long'}),
                    count: 0
                })
            }
        } else {
            final_questions.push({
                day: new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString('en-GB', {weekday: 'long'}),
                count: 0
            })
        }
    }
    console.log(final_questions);
    res.locals.perWeek={
        keywords: relations.slice(0,6),
        days: final_questions
    };
    next();
}

const titleQuestions = async(req, res, next) => {
    const titles = await Question.findAll({
        where: {
            title: {
                [sequelize.Op.substring]: req.params['tit']
            }
        }
    })
    return res.json(titles);
}

const latestQuestions = async(req, res, next) => {
    const result = await Question.findAll({limit:5, include: {model: Relation, attributes: ['keywordName']}, order: [['createdAt','DESC']] });
    const questions = [];
    for (q of result) {
        const keywords = []
        for (rel of q.relations) {
            keywords.push(rel.keywordName);
        }
        const data = {
            qId: q.qId,
            title: q.title,
            text: q.text,
            keywords: keywords,
        }
        questions.push(data);
    }
    res.locals.latest = questions;
    return next();
}

const userQuestionContribution = async (req, res, next) => {
    res.locals.questionContribution = await Question.count({
        attributes: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'date']],
        where: {
            userUsername: req.username,
        },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
    });
    return next();
}


const controller = {};

controller.createQuestion = createQuestion;
controller.getQuestion = getQuestion;
controller.allQuestions = allQuestions;
controller.moreQuestions = moreQuestions;
controller.usersQuestions = usersQuestions;
controller.moreUsersQuestions = moreUsersQuestions;
controller.keywordsQuestions = keywordsQuestions;
controller.perWeek = perWeek;
controller.titleQuestions = titleQuestions;
controller.latestQuestions = latestQuestions;
controller.userQuestionContribution = userQuestionContribution;



module.exports = controller;