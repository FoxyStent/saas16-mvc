

const main = (req, res, next) => {
    console.log(res.locals);
    res.render('main', {isLogged: res.locals.logged, perWeek: res.locals.perWeek, latest_questions: res.locals.latest});
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