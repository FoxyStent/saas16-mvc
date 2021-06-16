

const main = (req, res, next) => {
    res.render('main', {isLogged: req.logged})
}

const login = (req, res, next) => {
    res.render('login', {login: true})
}

const signup = (req, res, next) => {
    res.render('login', { login: false})
}

const controller = {};

controller.main = main;
controller.login = login;
controller.signup = signup;

module.exports = controller;