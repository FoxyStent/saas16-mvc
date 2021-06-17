const express = require('express');
const router = express.Router();
console.log(process.env.DB_URL)
const userController = require('../controllers/userController');
const viewController = require('../controllers/viewController')

/*
--- POST @ / => Returns Main View
--- GET @ /login => Returns Login View
--- GET @ /signup => Returns Sing Up View (login.ejs { login:false }
 */


router.get('/', userController.isLogged, viewController.main);

router.get('/login', userController.isLogged, viewController.login);

router.get('/signup', userController.isLogged, viewController.signup);

router.get('/ask', userController.isLogged, function (req, res,next){
  console.log(req.logged);
  res.render('ask', {isLogged: res.locals.logged})
});


module.exports = router;
