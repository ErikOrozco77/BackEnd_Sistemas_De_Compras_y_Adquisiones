import { NextFunction, Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "./entities/user.entity";
import { AppDataSource } from "./data-source";
import {
    AuthenticatedUser,
    Login,
    Logout,
    Refresh,
    Register,
} from "./controller/auth.controller";
import { CheckUser } from "./controller/user.controller";

const userRepository = AppDataSource.getRepository(User);

export const routes = (router: Router) => {
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/user", AuthenticatedUser);
    router.post("/api/refresh", Refresh);
    router.get("/api/refresh", Logout);

    router.get("/api/users/check/:token", CheckUser);
};

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies["accessToken"];
        if (accessToken) {
            const payload: any = verify(accessToken, "access_secret");
            if (!payload) {
                return res.status(401).send({
                    message: "No estas autorizado para acceder",
                });
            }
            const user = await userRepository.findOne({
                where: {
                    id: payload.id,
                },
            });

            if (!user) {
                return res.status(401).send({
                    message: "Este usuario no existe",
                });
            }

            return next();
        }
        return res.status(401).send({
            message: "No has iniciado sesion",
        });
    } catch (error) {
        return res.status(401).send({
            message:
                "error al comprobar sus credenciales, inicie sesion nuevamente",
            error: error,
        });
    }
};
