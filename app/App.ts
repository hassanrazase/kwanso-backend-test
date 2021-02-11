import express from 'express';
const jwt = require('jsonwebtoken');


import UserController from './UserController';

class App {

    public express: any;
    public router: any;
    public userController: UserController;

    constructor() {

        this.express = express();
        this.userController = new UserController();
        this.initRoutes();

        this.express.use(express.json());
        this.express.use(this.router);
    }

    public initRoutes(): void {

        this.router = express.Router()

        this.router.post('/register',       this.userController.register);
        this.router.post('/login',          this.userController.login);
        this.router.get('/user',            this.authMiddleware, this.userController.authUser);
        this.router.post('/create-task',    this.authMiddleware, this.userController.createTask);
        this.router.get('/list-tasks',      this.authMiddleware, this.userController.listTask);

    }

    public authMiddleware(req: any, res: any, next: any) {

        let tokenData: any;
        let token: any;

        let response: { code: number, message: any, data: any } = { code: 400, message: null, data: null };

        let bearerToken = req.get('Authorization');

        if (bearerToken) {

            tokenData = bearerToken.split(' ');

            if (tokenData.length == 2) {

                token = tokenData[1];

                jwt.verify(token, 'tDWNCSMc6WJv5P4WGpM4', function (error: any, decodedData: any) {
                    if (error === null) {
                        req.authUserId = decodedData.id;
                        next();
                    } else {
                        response.message = 'Token is malformed or expired';
                        res.json(response);
                    }
                });

            } else {
                response.message = 'Token is missing in headers';
                res.json(response);
            }
        } else {
            response.message = 'Authorization header not set';
            res.json(response);
        }
    }

}


export default new App().express;