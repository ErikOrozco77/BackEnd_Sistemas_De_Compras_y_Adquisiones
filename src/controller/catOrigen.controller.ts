import { Request, Response } from 'express';
import { CatOrigen } from '../entities/catOrigen.entity';
import { AppDataSource } from "../data-source";

const catOrigenRepository = AppDataSource.getRepository(CatOrigen);
export const getcatOrigenRepositoryList = async (req: Request, res: Response) => {
  try {
    const user = await catOrigenRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatOrigen:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatOrigen' });
  }
};
