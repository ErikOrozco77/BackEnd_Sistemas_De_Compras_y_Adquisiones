import { Request, Response } from 'express';
import { CatGiro } from '../entities/catGiro.entity';
import { AppDataSource } from "../data-source";

const catGiroRepository = AppDataSource.getRepository(CatGiro);
export const getcatGiroList = async (req: Request, res: Response) => {
  try {
    const user = await catGiroRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatGiro', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatGiro' });
  }
};
