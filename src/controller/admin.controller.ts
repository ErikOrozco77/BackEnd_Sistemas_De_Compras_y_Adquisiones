import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entities/proveedor.entity";

const proveedorRepository = AppDataSource.getRepository(Proveedor);

export const GetAllProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await proveedorRepository.find();
        res.status(200).send({
            message: "Lista de proveedores",
            data: proveedores,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al obtener la lista de proveedores",
            error: error,
        });
    }
};


