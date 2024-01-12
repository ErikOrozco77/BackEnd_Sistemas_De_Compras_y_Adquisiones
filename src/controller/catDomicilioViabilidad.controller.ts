import { Request, Response } from 'express';
import { CatDomicilioVialidad } from '../entities/catDomicilioVialidad.entity';
import { AppDataSource } from "../data-source";

const catDomicilioVialidadRepository = AppDataSource.getRepository(CatDomicilioVialidad);
export const getcatDomicilioVialidadList = async (req: Request, res: Response) => {
  try {
    const user = await catDomicilioVialidadRepository.find()
    console.log(user)
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatDomicilioVialidad:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatDomicilioVialidad' });
  }
};
