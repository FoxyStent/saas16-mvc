const db = require('../models/database');
const sequelize = db.sequelize
const User = db.user;
const Question = db.question;
const Answer = db.answer;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../utils/redis')
const createError = require("http-errors");



const createUser = async (req, res, next) => {
    const newUser = req.body;
    User.findByPk(newUser.username).then(response => {
        if (response)
            return res.status(403).send('UsernameUsed');
    })
    User.findOne({where: { email: newUser.email}}).then(response => {
        if (response)
            return res.status(403).send('EmailUsed');
    })

    User.create(newUser).then(response => {
        const access_token = jwt.sign({
            username: response.username,
            memberSince: response.memberSince,
            isRefresh: false
        }, process.env.TOKEN_SECRET, { expiresIn: 600});

        res.cookie('access_token', access_token, { expires: new Date(Date.now() + 600000)});

        res.json({
            refresh_token: jwt.sign({
                username: response.username,
                memberSince: response.memberSince,
                isRefresh: true,
            }, process.env.TOKEN_SECRET, { expiresIn: '60d'})
        })
    }).catch(e => {
        res.status(400).send('BadRequest');
        console.log(e);
    })
}

const login = async (req, res, next) => {
    const info = req.body;
    User.findByPk(info.username).then(response => {
        if (!response)
            return res.status(404).send('UserNotFound');
        bcrypt.compare(info.password, response.password).then(result => {
            if (result) {

                const access_token = jwt.sign({
                    username: response.username,
                    memberSince: response.memberSince,
                    isRefresh: false
                }, process.env.TOKEN_SECRET, { expiresIn: 600});

                res.cookie('access_token', access_token, { expires: new Date(Date.now() + 600000)});

                res.json({
                    refresh_token: jwt.sign({
                        username: response.username,
                        memberSince: response.memberSince,
                        isRefresh: true,
                    }, process.env.TOKEN_SECRET, { expiresIn: '60d'})
                })
            } else {
                return res.status(401).send('WrongPass');
            }
        })
    }).catch(e => {
        console.log(e);
        return res.status(404).send('UserNotFound');
    });
}

const logout = async (req, res, next) => {
    const refresh = req.body['refresh_token'];
    jwt.verify(refresh, process.env.TOKEN_SECRET, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).send('Invalid Refresh Token');
        }
        else {
            const ttl = Math.ceil(result['exp'] - Date.now() / 1000);
            console.log(typeof refresh);
            redis.set(refresh, 'invalid', 'PX', ttl);
        }
    })

    const access = req.cookies['access_token'];
    jwt.verify(access, process.env.TOKEN_SECRET, (error, result) => {
        if (error) {
            res.status(400).send('Invalid Access Token');
            console.log(error);
        }
        else {
            const ttl = Math.ceil(result['exp'] - Date.now() / 1000);
            console.log(typeof access);
            redis.set(access, 'invalid', 'PX', ttl);
        }
    })
    res.cookie('access_token', '', { expires: new Date(Date.now() - 999999999)})
    res.status(200).send('OK');
}

const refresh = async (req, res, next) => {
    const refresh = req.body['refresh_token'];
    redis.get(refresh, (error, result) => {
        if (error)
            res.sendStatus(400);
        if (result !== 'invalid') {
            jwt.verify(refresh, process.env.TOKEN_SECRET, (error, result) => {
                if (error) {
                    res.status(400).send('Invalid Refresh Token');
                    console.log(error);
                } else {
                    const access_token = jwt.sign({
                            username: result.username,
                            memberSince: result.memberSince,
                            isRefresh: false
                        }, process.env.TOKEN_SECRET, {expiresIn: 600})
                    res.cookie('access_token', access_token, { expires: 600});
                    res.json({
                        refresh_token: jwt.sign({
                            username: result.username,
                            memberSince: result.memberSince,
                            isRefresh: true,
                        }, process.env.TOKEN_SECRET, {expiresIn: '60d'})
                    })
                }
            })
        } else {
            res.status(400).send('Logged Out Refresh Token');
        }
    })
}

const authorize = async (req, res, next) => {
    if (!req.cookies['access_token'])
        res.sendStatus(401);
    const access_token = req.cookies['access_token'];
    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, result) => {
        if (err)
            res.status(401).send('Expired');
        else {
            req.username = result['username'];
            next();
        }
    })
    /*
    if (!req.headers['authorization'])
        res.sendStatus(401);
    const access_token = req.headers['authorization'].replace('Bearer ', '');
    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, result) => {
        if (err)
            res.sendStatus(401);
        else {
            req.username = result['username'];
            next();
        }
    })
     */
}

const profile = async (req, res, next) => {
    //User.findByPk(req.username, { attributes: ['username', 'email', 'name', 'memberSince']}).then(result => {
    //    res.render('main', result);
    //})
    const questions = await Question.findAll({where: { userUsername: req.username}, order: [['createdAt', 'DESC']]})
    const answers = await Answer.findAll({where: { userUsername: req.username}, order: [['createdAt', 'DESC']]});
    res.render('main', {
        isLogged:res.locals.logged,
        mainPage:false,
        questions: [...questions],
        answers: [...answers],
        perWeek: null,
        latest_questions: res.locals.latest,
        answer_cont: res.locals.answerContribution,
        question_cont: res.locals.questionContribution,
    })
}

const isLogged = async (req, res, next) => {
    console.log(req.cookies)
    if (req.cookies['access_token'] === null) {
        res.locals.logged = false;
        return next();
    }
    const access_token = req.cookies['access_token'];
    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, result) => {
        if (err) {
            res.locals.logged = false;
            return next();
        }
        else {
            res.locals.logged = true;
            return next();
        }
    })
}



const userController = {}

userController.createUser = createUser;
userController.login = login;
userController.logout = logout;
userController.refresh = refresh;
userController.authorize = authorize;
userController.profile = profile;
userController.isLogged = isLogged;

module.exports = userController;