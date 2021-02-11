const jwt = require('jsonwebtoken');



export default class UserController {

    static userAutoIncrementId: number = 0;
    static taskAutoIncrementId: number = 0;

    static users: { id: number, email: string, password: string }[] = [];
    static tasks: { id: number, name: string, userId: number }[] = [];


    constructor() { }


    register(req: any, res: any, next: any): void {

        let user: any = {
            id: ++UserController.userAutoIncrementId,
            email: req.body.email,
            password: req.body.password,
        };

        UserController.users.push(user);

        let userData = {
            id: user.id,
            email: user.email,
        };

        res.json(userData);
    }


    login(req: any, res: any, next: any): void {

        let user = UserController.users.find(user => user.email == req.body.email && user.password == req.body.password);

        if (user) {

            let generatedJwt = jwt.sign(
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

            res.json({
                jwt: generatedJwt
            });
        }
        else {
            res.json({
                status: 400,
                message: 'User not found',
                data: null,
            });
        }
    }


    authUser(req: any, res: any, next: any): void {

        let user = UserController.users.find(user => user.id == req.authUserId);

        if (user) {

            let userData = {
                id: user.id,
                email: user.email,
            }

            res.json(userData);
        }
        else {
            res.json({
                status: 400,
                message: 'User not found',
                data: null,
            });
        }

    }

    createTask(req: any, res: any, next: any): void {

        let task: any = {
            id: ++UserController.taskAutoIncrementId,
            name: req.body.name,
            userId: req.authUserId,
        };

        UserController.tasks.push(task);

        let taskData = {
            id: task.id,
            name: task.name,
        };

        res.json(taskData);
    }


    listTask(req: any, res: any, next: any): void {

        console.log(UserController.tasks);
        console.log(req.authUserId);

        let userTasks = UserController.tasks.filter(task => task.userId == req.authUserId);

        res.json({
            tasks: userTasks
        });
    }


}