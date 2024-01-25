import { Request, Response } from 'express';
import { CatRepresentanteLegalTipoAcreditacion } from '../entities/catRepresentanteLegalTipoAcreditacion.entity';
import { AppDataSource } from "../data-source";

const catRepresentanteLegalTipoAcreditacionRepository = AppDataSource.getRepository(CatRepresentanteLegalTipoAcreditacion);
export const getcatRepresentanteLegalTipoAcreditacionList = async (req: Request, res: Response) => {
  try {
    const user = await catRepresentanteLegalTipoAcreditacionRepository.find()
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la lista de CatRepresentanteLegalTipoAcreditacion:', error);
    res.status(500).json({ error: 'Error al obtener la lista de CatRepresentanteLegalTipoAcreditacion' });
  }
};
