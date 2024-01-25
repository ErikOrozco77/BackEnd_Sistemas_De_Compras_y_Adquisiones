import { Request, Response } from 'express';
import { CatRealizaSubcontrataciones } from '../entities/catRealizaSubcontrataciones.entity';
import { AppDataSource } from "../data-source";

const catRealizaSubcontratacionesRepository = AppDataSource.getRepository(CatRealizaSubcontrataciones);
export const getcatRealizaSubcontratacionesList = async (req: Request, res: Response) => {
  try {
    const user = await catRealizaSubcontratacionesRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatRealizaSubcontrataciones:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatRealizaSubcontrataciones' });
  }
};
