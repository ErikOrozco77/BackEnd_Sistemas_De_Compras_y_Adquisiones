import { Request, Response } from 'express';
import { CatEntidadFederativa } from '../entities/catEntidadFederativa.entity';
import { AppDataSource } from "../data-source";

const catEntidadFederativaRepository = AppDataSource.getRepository(CatEntidadFederativa);
export const getcatEntidadFederativaList = async (req: Request, res: Response) => {
  try {
    const user = await catEntidadFederativaRepository.find()
    console.log(user)
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatEntidadFederativa:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatEntidadFederativa' });
  }
};
