const express = require('express');
const routes = express.Router();
const Login = require('../controllers/Login');
const Auth = require('../middleware/Auth');
const Watch = require('../controllers/Watch');
const Channel = require('../controllers/Channel');

routes.post('/login', Login.loginValidateForm, Login.login);
routes.post('/register', Login.registerFormValidation, Login.register);
routes.get('/logout', Auth, Login.logout);
routes.get('/user', Auth, Login.user);
routes.get('/channel/:id', Auth, Login.user);
routes.post('/video/add', Auth, Watch.upload);
routes.put('/video/update', Auth, Watch.upload);
routes.get('/videos', Auth, Watch.videoList);
routes.get('/video/:slug', Auth, Watch.videoInfo);

module.exports = routes;