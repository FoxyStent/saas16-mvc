const db = require('../models/database');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../utils/redis')

const createUser = async (req, res, next) => {
    const newUser = req.body;
    User.create(newUser)
    res.json({
        access_token: jwt.sign({
            username: newUser.username,
            memberSince: newUser.memberSince,
            isRefresh: false
        }, process.env.TOKEN_SECRET, { expiresIn: 600}),
        refresh_token: jwt.sign({
            username: newUser.username,
            memberSince: newUser.memberSince,
            isRefresh: true,
        }, process.env.TOKEN_SECRET, { expiresIn: '60d'})
    })
}

const login = async (req, res, next) => {
    const info = req.body;
    User.findByPk(info.username).then(response => {
        bcrypt.compare(info.password, response.password).then(result => {
            if (result) {
                res.json({
                    access_token: jwt.sign({
                        username: response.username,
                        memberSince: response.memberSince,
                        isRefresh: false
                    }, process.env.TOKEN_SECRET, { expiresIn: 600}),
                    refresh_token: jwt.sign({
                        username: response.username,
                        memberSince: response.memberSince,
                        isRefresh: true,
                    }, process.env.TOKEN_SECRET, { expiresIn: '60d'})
                })
            } else {
                res.sendStatus(401);
            }
        })
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

    const access = req.headers['authorization'].replace('Bearer ', '');
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
    res.render('main');
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
                    res.json({
                        access_token: jwt.sign({
                            username: result.username,
                            memberSince: result.memberSince,
                            isRefresh: false
                        }, process.env.TOKEN_SECRET, {expiresIn: 600}),
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
    const access_token = req.headers['authorization'].replace('Bearer ', '');
    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, result) => {
        if (err)
            res.sendStatus(401);
        else {
            req.username = result['username'];
            next();
        }
    })
}

const profile = async (req, res, next) => {
    User.findByPk(req.username, { attributes: ['username', 'email', 'name', 'memberSince']}).then(result => {
        res.render('main', result);
    })
}

const userController = {}

userController.createUser = createUser;
userController.login = login;
userController.logout = logout;
userController.refresh = refresh;
userController.authorize = authorize;
userController.profile = profile;

module.exports = userController;