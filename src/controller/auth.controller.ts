import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { sendConfirmationEmail } from "../utils/mailer";

const userRepository = AppDataSource.getRepository(User);

export const Register = async (req: Request, res: Response) => {
    try {
        const { names, email, password } = req.body;
        const test = await userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne();
        console.log(test);
        if (test) {
            return res.status(400).send({
                message: "Usuario duplicado",
            });
        }
        const accessToken = sign(
            {
                username: email,
            },
            "access_secret",
            { expiresIn: 7 * 24 * 60 * 60 * 1000 }
        );

        //const hshedPassword = await bcryptjs.hash(password, 10);
        const user = await userRepository.save({
            names,
            password,
            email,
            isActive: false, // El usuario no está activo hasta que se verifique el token
            registrationDate: new Date(),
            confirmationToken: accessToken.substring(0, 24),
            confirmationTokenExpiration: new Date(
                new Date().getTime() + 5 * 24 * 60 * 60 * 1000
            ),
        });
        sendConfirmationEmail(names, email, accessToken.substring(0, 24));
        res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error al guardar la información",
            error: error,
        });
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findOne({
            where: [
                {
                    email: email,
                },
            ],
        });
        if (!user) {
            return res.status(400).send({
                message: "Credenciales no validas",
            });
        }
        if (!(await bcryptjs.compare(password, user.password))) {
            return res.status(400).send({
                message: "Credenciales no validas",
            });
        }
        const accessToken = sign(
            {
                id: user.id,
            },
            "access_secret",
            { expiresIn: 60 * 60 }
        );
        const refreshToken = sign({ id: user.id }, "refresh_secret", {
            expiresIn: 24 * 60 * 60,
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //equivalent to 7 days
        });
        const data = {};
        Object.assign(data, {
            id: user.id,
            name: user.names,
            email: user.email,
        });
        return res.status(200).send({
            message: "Inicio de sesion correcto",
            data: data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Falla en el inicio de sesion",
        });
    }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const accessToken = req.cookies["accessToken"];

        const payload: any = verify(accessToken, "access_secret");

        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated",
            });
        }

        const user = await userRepository.findOne({
            where: {
                id: payload.id,
            },
        });

        if (!user) {
            return res.status(401).send({
                message: "Unauthenticated",
            });
        }

        const { password, ...data } = user;

        res.send(data);
    } catch (e) {
        return res.status(401).send({
            message: "Unauthenticated",
        });
    }
};

export const Refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies["refreshToken"];

        const payload: any = verify(refreshToken, "refresh_secret");

        if (!payload) {
            return res.status(401).send({
                message: "unauthenticated",
            });
        }

        const accessToken = sign(
            {
                id: payload.id,
            },
            "access_secret",
            { expiresIn: 60 * 60 }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
        });

        res.send({
            message: "success",
        });
    } catch (e) {
        return res.status(401).send({
            message: "unauthenticated",
        });
    }
};

export const Logout = async (req: Request, res: Response) => {
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    return res.status(200).send({
        message: "Sesion terminada",
    });
};
