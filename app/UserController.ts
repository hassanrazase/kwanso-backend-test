import express, { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from './models/User';
import { Task } from './models/Task';
import { RegisterResponse } from './types/responses/RegisterResponse';
import { AuthUserResponse } from './types/responses/AuthUserResponse';
import { TaskListResponse } from './types/responses/TaskListResponse';
import { LoginResponse } from './types/responses/LoginResponse';
import { TaskResponse } from './types/responses/TaskResponse';
import { Response } from './types/responses/Response';


export class UserController {

    static userAutoIncrementId: number = 0;
    static taskAutoIncrementId: number = 0;

    static users: User[] = [];
    static tasks: Task[] = [];


    constructor() { }


    register(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let user: User = {
            id: ++UserController.userAutoIncrementId,
            email: req.body.email,
            password: req.body.password,
        };

        UserController.users.push(user);

        let userData: RegisterResponse = {
            id: user.id,
            email: user.email,
        };

        res.json(userData);
    }


    login(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let user = UserController.users.find((user: User) => user.email == req.body.email && user.password == req.body.password);

        if (user) {

            let generatedJwt: string = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    password: user.password,
                },
                'tDWNCSMc6WJv5P4WGpM4', // secret
                {
                    expiresIn: 86400
                }
            );

            let userData: LoginResponse = {
                jwt: generatedJwt
            };

            res.json(userData);
        }
        else {

            let response: Response = {
                code: 400,
                message: 'User not found',
                data: null,
            };

            res.json(response);
        }
    }


    authUser(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let user = UserController.users.find((user: User) => user.id == req.body.authUserId);

        if (user) {

            let userData: AuthUserResponse = {
                id: user.id,
                email: user.email,
            }

            res.json(userData);
        }
        else {

            let response: Response = {
                code: 400,
                message: 'User not found',
                data: null,
            };

            res.json(response);
        }

    }

    createTask(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let task: Task = {
            id: ++UserController.taskAutoIncrementId,
            name: req.body.name,
            userId: req.body.authUserId,
        };

        UserController.tasks.push(task);

        let taskData: TaskResponse = {
            id: task.id,
            name: task.name,
        };

        res.json(taskData);
    }


    listTask(req: express.Request, res: express.Response, next: express.NextFunction): void {

        let userTasks = UserController.tasks.filter((task: Task) => task.userId == req.body.authUserId);

        let taskData: TaskListResponse = {
            tasks: userTasks
        };

        res.json(taskData);
    }
}