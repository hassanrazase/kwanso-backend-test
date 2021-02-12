import express, { Router } from 'express';
import * as jwt from 'jsonwebtoken';

import { Response } from './types/responses/Response';
import { UserController } from './UserController';

class App {

    public express: express.Application;
    public router: Router;
    public userController: UserController;

    constructor() {

        this.express = express();
        this.router = express.Router()

        this.userController = new UserController();
        this.initRoutes();

        this.express.use(express.json());
        this.express.use(this.router);
    }

    public initRoutes(): void {


        this.router.post('/register', this.userController.register);
        this.router.post('/login', this.userController.login);
        this.router.get('/user', this.authMiddleware, this.userController.authUser);
        this.router.post('/create-task', this.authMiddleware, this.userController.createTask);
        this.router.get('/list-tasks', this.authMiddleware, this.userController.listTask);

    }

    public authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let token: string;
        let tokenData: Array<string>;
        let response: Response = { code: 400, message: null, data: null };


        let bearerToken: (string | undefined) = req.get('Authorization');

        if (bearerToken) {

            tokenData = bearerToken.split(' ');

            if (tokenData.length == 2) {

                token = tokenData[1];

                jwt.verify(token, 'tDWNCSMc6WJv5P4WGpM4', (error: jwt.JsonWebTokenError | jwt.NotBeforeError | jwt.TokenExpiredError | null, decodedData: any | undefined) => {
                    if (error === null) {
                        req.body.authUserId = decodedData.id;
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