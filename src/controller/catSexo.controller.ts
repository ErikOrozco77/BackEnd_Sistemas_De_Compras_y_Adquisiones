import { Request, Response } from 'express';
import { CatSexo } from '../entities/catSexo.entity';
import { AppDataSource } from "../data-source";

const catSexoRepository = AppDataSource.getRepository(CatSexo);
export const getcatSexoList = async (req: Request, res: Response) => {
  try {
    const user = await catSexoRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatSexo:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatSexo' });
  }
};
