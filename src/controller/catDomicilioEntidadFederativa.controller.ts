import { Request, Response } from 'express';
import { CatDomicilioEntidadFederativa } from '../entities/catDomicilioEntidadFederativa.entity';
import { AppDataSource } from "../data-source";

const catDomicilioEntidadFederativaRepository = AppDataSource.getRepository(CatDomicilioEntidadFederativa);
export const getcatDomicilioEntidadFederativaList = async (req: Request, res: Response) => {
  try {
    const user = await catDomicilioEntidadFederativaRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatDomicilioEntidadFederativa:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatDomicilioEntidadFederativa' });
  }
};