import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entities/proveedor.entity";
import { log } from "console";
import fs from "fs";
import path from "path";
import { createReadStream } from 'fs';


const proveedorRepository = AppDataSource.getRepository(Proveedor);

export const RegisterProveedor = async (req: Request, res: Response) => {
    try {
        const { id
            , nombre
            , primerApellido
            , segundoApellido
            , razonSocial
            , estratificacion
            , paisOrigen
            , rfc
            , actividadEconomica
            , domicilioNombre
            , domicilioNumeroExterior
            , domicilioNumeroInterior
            , domicilioNombreAsentamiento
            , domicilioClaveLocalidad
            , domicilioNombreLocalidad
            , domicilioClaveMunicipio
            , domicilioNombreMunicipio
            , domicilioClaveEntidad
            , domicilioCP
            , extranjeroPais
            , extranjeroCiudad
            , extranjeroCalle
            , extranjeroNumero
            , representanteLegalNombre
            , representanteLegalPrimerApellido
            , representanteLegalSegundoApellido
            , representanteLegalTelefono
            , representanteLegalMail
            , website
            , telefono
            , catSexoId
            , catOrigenId
            , catEntidadFederativaId
            , catRealizaSubcontratacionesId
            , catDomicilioVialidadId
            , catDomicilioTipoAsentamientoId
            , catDomicilioEntidadFederativaId
            , catRepresentanteLegalTipoAcreditacionId
            , user_id } = req.body;
        const proveedorExistente = await proveedorRepository.findOne({
            where: {
                user_id: user_id
            }
        });

        if (proveedorExistente) {
            return res.status(400).json({ error: "Ya tiene un proveedor registrado" });
        }
        const nuevoProveedor = new Proveedor();
        nuevoProveedor.id = id;
        nuevoProveedor.nombre = nombre;
        nuevoProveedor.primerApellido = primerApellido;
        nuevoProveedor.segundoApellido = segundoApellido;
        nuevoProveedor.razonSocial = razonSocial;
        nuevoProveedor.estratificacion = estratificacion;
        nuevoProveedor.paisOrigen = paisOrigen;
        nuevoProveedor.rfc = rfc;
        nuevoProveedor.actividadEconomica = actividadEconomica;
        nuevoProveedor.domicilioNombre = domicilioNombre;
        nuevoProveedor.domicilioNumeroExterior = domicilioNumeroExterior;
        nuevoProveedor.domicilioNumeroInterior = domicilioNumeroInterior;
        nuevoProveedor.domicilioNombreAsentamiento = domicilioNombreAsentamiento;
        nuevoProveedor.domicilioClaveLocalidad = domicilioClaveLocalidad;
        nuevoProveedor.domicilioNombreLocalidad = domicilioNombreLocalidad;
        nuevoProveedor.domicilioClaveMunicipio = domicilioClaveMunicipio;
        nuevoProveedor.domicilioNombreMunicipio = domicilioNombreMunicipio;
        nuevoProveedor.domicilioClaveEntidad = domicilioClaveEntidad;
        nuevoProveedor.domicilioCP = domicilioCP;
        nuevoProveedor.extranjeroPais = extranjeroPais;
        nuevoProveedor.extranjeroCiudad = extranjeroCiudad;
        nuevoProveedor.extranjeroCalle = extranjeroCalle;
        nuevoProveedor.extranjeroNumero = extranjeroNumero;
        nuevoProveedor.representanteLegalNombre = representanteLegalNombre;
        nuevoProveedor.representanteLegalPrimerApellido = representanteLegalPrimerApellido;
        nuevoProveedor.representanteLegalSegundoApellido = representanteLegalSegundoApellido;
        nuevoProveedor.representanteLegalTelefono = representanteLegalTelefono;
        nuevoProveedor.representanteLegalMail = representanteLegalMail;
        nuevoProveedor.website = website;
        nuevoProveedor.telefono = telefono;
        nuevoProveedor.CatSexo = catSexoId;
        nuevoProveedor.CatOrigen = catOrigenId;
        nuevoProveedor.CatEntidadFederativa = catEntidadFederativaId;
        nuevoProveedor.CatRealizaSubcontrataciones = catRealizaSubcontratacionesId;
        nuevoProveedor.CatDomicilioVialidad = catDomicilioVialidadId;
        nuevoProveedor.CatDomicilioTipoAsentamiento = catDomicilioTipoAsentamientoId;
        nuevoProveedor.CatDomicilioEntidadFederativa = catDomicilioEntidadFederativaId;
        nuevoProveedor.CatRepresentanteLegalTipoAcreditacion = catRepresentanteLegalTipoAcreditacionId;
        nuevoProveedor.user_id = user_id;

        await proveedorRepository.save(nuevoProveedor);

        res.status(201).json({ message: "Proveedor registrado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el proveedor" });

    }

};

export const UpdateProveedor = async (req: Request, res: Response) => {
    try {
        const {
            id,
            user_id
            , nombre
            , primerApellido
            , segundoApellido
            , razonSocial
            , estratificacion
            , paisOrigen
            , rfc
            , actividadEconomica
            , domicilioNombre
            , domicilioNumeroExterior
            , domicilioNumeroInterior
            , domicilioNombreAsentamiento
            , domicilioClaveLocalidad
            , domicilioNombreLocalidad
            , domicilioClaveMunicipio
            , domicilioNombreMunicipio
            , domicilioClaveEntidad
            , domicilioCP
            , extranjeroPais
            , extranjeroCiudad
            , extranjeroCalle
            , extranjeroNumero
            , representanteLegalNombre
            , representanteLegalPrimerApellido
            , representanteLegalSegundoApellido
            , representanteLegalTelefono
            , representanteLegalMail
            , website
            , telefono
            , catSexoId
            , catOrigenId
            , catEntidadFederativaId
            , catRealizaSubcontratacionesId
            , catDomicilioVialidadId
            , catDomicilioTipoAsentamientoId
            , catDomicilioEntidadFederativaId
            , catRepresentanteLegalTipoAcreditacionId, otherFields } = req.body;

        const proveedorExistente = await proveedorRepository.findOne({
            where: [
                {
                    user_id: user_id
                },
            ],
        });
        if (!proveedorExistente) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        } else {
            Object.assign(proveedorExistente, otherFields);
            proveedorExistente.nombre = nombre;
            proveedorExistente.primerApellido = primerApellido;
            proveedorExistente.segundoApellido = segundoApellido;
            proveedorExistente.razonSocial = razonSocial;
            proveedorExistente.estratificacion = estratificacion;
            proveedorExistente.paisOrigen = paisOrigen;
            proveedorExistente.rfc = rfc;
            proveedorExistente.actividadEconomica = actividadEconomica;
            proveedorExistente.domicilioNombre = domicilioNombre;
            proveedorExistente.domicilioNumeroExterior = domicilioNumeroExterior;
            proveedorExistente.domicilioNumeroInterior = domicilioNumeroInterior;
            proveedorExistente.domicilioNombreAsentamiento = domicilioNombreAsentamiento;
            proveedorExistente.domicilioClaveLocalidad = domicilioClaveLocalidad;
            proveedorExistente.domicilioNombreLocalidad = domicilioNombreLocalidad;
            proveedorExistente.domicilioClaveMunicipio = domicilioClaveMunicipio;
            proveedorExistente.domicilioNombreMunicipio = domicilioNombreMunicipio;
            proveedorExistente.domicilioClaveEntidad = domicilioClaveEntidad;
            proveedorExistente.domicilioCP = domicilioCP;
            proveedorExistente.extranjeroPais = extranjeroPais;
            proveedorExistente.extranjeroCiudad = extranjeroCiudad;
            proveedorExistente.extranjeroCalle = extranjeroCalle;
            proveedorExistente.extranjeroNumero = extranjeroNumero;
            proveedorExistente.representanteLegalNombre = representanteLegalNombre;
            proveedorExistente.representanteLegalPrimerApellido = representanteLegalPrimerApellido;
            proveedorExistente.representanteLegalSegundoApellido = representanteLegalSegundoApellido;
            proveedorExistente.representanteLegalTelefono = representanteLegalTelefono;
            proveedorExistente.representanteLegalMail = representanteLegalMail;
            proveedorExistente.website = website;
            proveedorExistente.telefono = telefono;
            proveedorExistente.CatSexo = catSexoId;
            proveedorExistente.CatOrigen = catOrigenId;
            proveedorExistente.CatDomicilioEntidadFederativa = catDomicilioEntidadFederativaId;
            proveedorExistente.CatRealizaSubcontrataciones = catRealizaSubcontratacionesId;
            proveedorExistente.CatDomicilioVialidad = catDomicilioVialidadId;
            proveedorExistente.CatDomicilioTipoAsentamiento = catDomicilioTipoAsentamientoId;
            proveedorExistente.CatEntidadFederativa = catEntidadFederativaId;
            proveedorExistente.CatRepresentanteLegalTipoAcreditacion = catRepresentanteLegalTipoAcreditacionId;

            await proveedorRepository.save(proveedorExistente);
            res.status(200).json({ message: "Proveedor actualizado con éxito" });
        }
    } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
        res.status(500).json({ error: "Error al actualizar el proveedor" });
    }
};

export const GetProveedorByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const proveedor = await proveedorRepository.findOne({
            where: {
                user_id: userId
            }
        });
        if (!proveedor) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        console.error("Error al obtener datos prellenados del proveedor:", error);
        res.status(500).json({ error: "Error al obtener datos prellenados" });
    }


};

export const UploadFiles = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user_id;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files) {
            return res.status(400).json({ error: "No se han proporcionado archivos" });
        }

        const ineFile = files.ine?.[0];
        const constanciaFile = files.constancia?.[0];

        if (!ineFile || !constanciaFile) {
            return res.status(400).json({ error: "Debes proporcionar ambos archivos: INE y constancia de situación fiscal" });
        }

        if (ineFile.mimetype !== 'application/pdf' || constanciaFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: "Los archivos deben ser de tipo PDF" });
        }

        // Construir las rutas de los archivos directamente en el directorio
        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);
        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);

        // Inicializar variables con valor predeterminado
        let ineFileExists = false;
        let constanciaFileExists = false;

        // Verificar si el usuario ya ha subido archivos
        if (fs.existsSync(ineFilePath)) {
            ineFileExists = true;
        }

        if (fs.existsSync(constanciaFilePath)) {
            constanciaFileExists = true;
        }

        if (ineFileExists || constanciaFileExists) {
            return res.status(400).json({ error: "El usuario ya ha subido archivos previamente" });
        }

        // Guardar archivos en el sistema de archivos
        fs.writeFileSync(ineFilePath, ineFile.buffer, 'binary');
        fs.writeFileSync(constanciaFilePath, constanciaFile.buffer, 'binary');

        res.status(200).json({ message: "Archivos PDF subidos con éxito" });
    } catch (error) {
        console.error("Error al subir archivos PDF:", error);
        res.status(500).json({ error: "Error al subir archivos PDF" });
    }
};



export const GetINEByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);

        if (!fs.existsSync(ineFilePath)) {
            return res.status(404).json({ error: "Archivo INE no encontrado" });
        }

        const ineFileContent = fs.readFileSync(ineFilePath);

        res.setHeader('Content-Disposition', `attachment; filename=INE_${userId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(ineFileContent);
        console.log('Ruta del archivo INE:', ineFilePath);
    } catch (error) {
        console.error("Error al obtener archivo INE:", error);
        res.status(500).json({ error: "Error al obtener archivo INE" });
    }
};

export const GetConstanciaByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);

        if (!fs.existsSync(constanciaFilePath)) {
            return res.status(404).json({ error: "Archivo Constancia no encontrado" });
        }

        const constanciaFileContent = fs.readFileSync(constanciaFilePath);

        res.setHeader('Content-Disposition', `attachment; filename=Constancia_${userId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(constanciaFileContent);
        console.log('Ruta del archivo Constancia:', constanciaFilePath);
    } catch (error) {
        console.error("Error al obtener archivo Constancia:", error);
        res.status(500).json({ error: "Error al obtener archivo Constancia" });
    }
};





