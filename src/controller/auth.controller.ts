import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { sendConfirmationEmail } from "../utils/mailer";
import { CatRoles } from "../entities/catRoles.entity";
import nodemailer from "nodemailer";
import crypto from "crypto";

const bcrypt = require('bcrypt');
const saltRounds = 10;
const userRepository = AppDataSource.getRepository(User);
const catRolesRepository = AppDataSource.getRepository(CatRoles);

export const Register = async (req: Request, res: Response) => {
    try {
        const { username, correo, rfc, recaptchaToken } = req.body;
        const recaptchaSecretKey = '6Lf35JcpAAAAAM6Xy7rz1WQHchQi5IwU7GlUNVHX';
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaResult = await recaptchaResponse.json();

        if (!recaptchaResult.success) {
            return res.status(400).send({
                message: 'Por favor, resuelve el captcha antes de enviar sus datos.',
            });
        }

        const names = username;
        const email = correo;
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
        const { email, password, recaptchaToken } = req.body;
        const recaptchaSecretKey = '6Lf35JcpAAAAAM6Xy7rz1WQHchQi5IwU7GlUNVHX';
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaResult = await recaptchaResponse.json();
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
                message: "El correo electronico que has introducido es incorrecto.",
            });
        }
        if (!(await bcryptjs.compare(password, user.password))) {
           
            return res.status(400).send({
                message: "La contraseña que has introducido es incorrecta.",
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
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const data = {};
        Object.assign(data, {
            id: user.id,
            name: user.names,
            email: user.email,
            rol: rolId,

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
            maxAge: 24 * 60 * 60 * 1000,
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

        await userRepository.update({ id: userByToken.id }, { password: hashedPassword, confirmationToken: '', isActive: true });

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

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        
        const recaptchaSecretKey = '6Lf35JcpAAAAAM6Xy7rz1WQHchQi5IwU7GlUNVHX'
        const { email, recaptchaToken } = req.body;
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
        const recaptchaResult = await recaptchaResponse.json();
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({
                message: 'Usuario no encontrado',
            });
        }
        const resetToken = await generateUniqueToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpires = new Date(Date.now() + 3600000); 

        await userRepository.save(user);

        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).send({
            message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error al solicitar el restablecimiento de contraseña',
            error: error,
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userRepository.findOne({ where: { resetPasswordToken: token } });

        if (!user) {
            return res.status(400).send({
                message: 'El token es inválido',
            });
        }

        if (!user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < new Date()) {
            return res.status(400).send({
                message: 'El token ha expirado',
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpires = null;

        await userRepository.save(user);

        res.status(200).send({
            message: 'Contraseña actualizada con éxito',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error al restablecer la contraseña',
            error: error,
        });
    }
};

const generateUniqueToken = async () => {
    try {
        const token = crypto.randomBytes(20).toString('hex');
        return token;
    } catch (error) {
        console.error("Error al generar el token único:", error);
        throw error;
    }
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "orozcoalcarazerik@gmail.com",
        pass: "hjlg cnuv xjtl csrk",
    },
});

export async function sendPasswordResetEmail(email: string, token: string) {
    try {
        const mailOptions = {
            from: "orozcoalcarazerik@gmail.com",
            to: email,
            subject: "Restablecimiento de contraseña",
            text:
            `Estimado/a usuario/a,\n\n` +
            "Hemos recibido una solicitud para restablecer la contraseña de su cuenta. Si usted no ha solicitado esto, puede ignorar este correo electrónico.\n\n" +
            "Para restablecer su contraseña, por favor haga clic en el siguiente enlace o copie y pegue en su navegador:\n" +
            `http://localhost:4200/new-password/${token}\n\n` +
            "Este enlace es válido por 1 hora. Si no realiza ninguna acción dentro de este tiempo, tendrá que solicitar un nuevo restablecimiento de contraseña.\n\n" +
            "Si tiene alguna pregunta o necesita asistencia adicional, no dude en ponerse en contacto con nuestro equipo.\n\n" +
            "Gracias.\n\n" +
            "Atentamente,\n" +
            "Equipo de soporte técnico"
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado:", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
}