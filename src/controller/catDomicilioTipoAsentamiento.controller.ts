import { Request, Response } from 'express';
import { CatDomicilioTipoAsentamiento } from '../entities/catDomicilioTipoAsentamiento.entity';
import { AppDataSource } from "../data-source";

const catDomicilioTipoAsentamientoRepository = AppDataSource.getRepository(CatDomicilioTipoAsentamiento);
export const getcatDomicilioTipoAsentamientoList = async (req: Request, res: Response) => {
  try {
    const user = await catDomicilioTipoAsentamientoRepository.find()
    console.log(user)
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatDomicilioTipoAsentamiento:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatDomicilioTipoAsentamiento' });
  }
};
