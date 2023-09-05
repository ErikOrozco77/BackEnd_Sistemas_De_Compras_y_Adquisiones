import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const CheckUser = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        const user = await userRepository.findOne({
            where: [
                {
                    confirmationToken: token,
                    isActive: false,
                },
            ],
        });
        if (!user) {
            return res.status(400).send({
                message: "El usuario no está registrado",
            });
        }
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
