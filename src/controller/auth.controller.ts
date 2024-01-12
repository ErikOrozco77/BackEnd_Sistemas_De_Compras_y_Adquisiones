import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { sendConfirmationEmail } from "../utils/mailer";
import mysql from 'mysql2/promise'; 
import { CatRoles } from "../entities/catRoles.entity";



const userRepository = AppDataSource.getRepository(User);
const catRolesRepository = AppDataSource.getRepository(CatRoles);

export const Register = async (req: Request, res: Response) => {
    try {
        const { username, correo,rfc} = req.body;
        const names=username;
        const email=correo;
        const rolId = 2;

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
        const catRoles = await catRolesRepository.findOne({ where: { id: 2 } });
        const accessToken = sign(
            {
                username: email,
            },
            "access_secret",
            { expiresIn: 7 * 24 * 60 * 60 * 1000 }
        );

        const user = await userRepository.save({
            names,
            email,
            rfc,
            rol: { id: 2 },
            isActive: false,
            registrationDate: new Date(),
            confirmationToken: accessToken.substring(130, 160),
            confirmationTokenExpiration: new Date(
                new Date().getTime() + 5 * 24 * 60 * 60 * 1000
            ),
        });
        sendConfirmationEmail(names, email, accessToken.substring(130, 160));
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
    console.log(req.body)
    try {
        const { email, password } = req.body;
        const user = await userRepository.findOne({
            where: [
                {
                    email: email,
                },
            ],
        });
        console.log(user)
        if (!user) {
            return res.status(400).send({
                message: "Credenciales no validas",
            });
        }
        if (!(await bcryptjs.compare(password, user.password))) {
            console.log("Contraseña incorrecta")
            return res.status(400).send({
                message: "Credenciales no validas",
            });
        }
        const rolId = user.rol.id;
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
            rol:rolId,

        });
        console.log(data);
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

const bcrypt = require('bcrypt');
const saltRounds = 10;


export const registerPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (password === undefined || token === undefined) {
            return res.status(400).send({
                message: 'Parámetros no válidos',
            });
        }

        const userByToken = await userRepository.findOne({ where: { confirmationToken: token } });

        if (!userByToken) {
            return res.status(404).send({
                message: 'Usuario no encontrado',
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userRepository.update({ id: userByToken.id }, { password: hashedPassword, confirmationToken: '',isActive: true});

        res.status(201).send({
            message: 'Contraseña registrada con éxito',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error al guardar la contraseña',
            error: error,
        });
    }
};