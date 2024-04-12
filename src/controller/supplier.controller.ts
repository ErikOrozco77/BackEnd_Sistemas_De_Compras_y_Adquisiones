import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entities/proveedor.entity";
import fs from "fs";
import path from "path";

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
            , catGiroId
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
        nuevoProveedor.CatGiro = catGiroId;
        nuevoProveedor.user_id = user_id;

        await proveedorRepository.save(nuevoProveedor);

        res.status(201).json({ message: "Proveedor registrado con éxito" });

    } catch (error) {
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
            , catRepresentanteLegalTipoAcreditacionId
            , catGiroId
            , otherFields } = req.body;

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
            proveedorExistente.CatGiro = catGiroId;
            proveedorExistente.CatRepresentanteLegalTipoAcreditacion = catRepresentanteLegalTipoAcreditacionId;

            await proveedorRepository.save(proveedorExistente);
            res.status(200).json({ message: "Proveedor actualizado con éxito" });
        }
    } catch (error) {
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
        res.status(500).json({ error: "Error al obtener datos prellenados" });
    }


};

export const GetINEByAdmin = async (req: Request, res: Response) => {
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
        res.status(500).json({ error: "Error al obtener archivo INE" });
    }
};

export const GetConstanciaByAdmin = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({ error: "Error al obtener archivo Constancia" });
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

        
        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);
        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);

        
        let ineFileExists = false;
        let constanciaFileExists = false;

        
        if (fs.existsSync(ineFilePath)) {
            ineFileExists = true;
        }

        if (fs.existsSync(constanciaFilePath)) {
            constanciaFileExists = true;
        }

        if (ineFileExists || constanciaFileExists) {
            return res.status(400).json({ error: "El usuario ya ha subido archivos previamente" });
        }

        
        fs.writeFileSync(ineFilePath, ineFile.buffer, 'binary');
        fs.writeFileSync(constanciaFilePath, constanciaFile.buffer, 'binary');

        res.status(200).json({ message: "Archivos PDF subidos con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al subir archivos PDF" });
    }
};

export const GetINEInfoByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);

        const fileExists = fs.existsSync(ineFilePath);

        if (!fileExists) {
            return res.status(404).json({ error: "Archivo INE no encontrado", exists: false });
        }

        const fileContent = fs.readFileSync(ineFilePath, 'binary');
        res.setHeader('Content-Length', fileContent.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=INE_${userId}.pdf`);
        res.status(200).end(fileContent, 'binary');
    } catch (error) {
        res.status(500).json({ error: "Error al obtener información y descargar archivo INE" });
    }
};

export const GetConstanciaInfoByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);

        const fileExists = fs.existsSync(constanciaFilePath);

        if (!fileExists) {
            return res.status(404).json({ error: "Archivo Constancia no encontrado", exists: false });
        }

        const fileContent = fs.readFileSync(constanciaFilePath, 'binary');
        res.setHeader('Content-Length', fileContent.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Constancia_${userId}.pdf`);
        res.status(200).end(fileContent, 'binary');
    } catch (error) {
        res.status(500).json({ error: "Error al obtener información y descargar archivo Constancia" });
    }
};

export const ReplaceINE = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user_id;
        const files = req.files;

        if (!files || !('ine' in files)) {
            return res.status(400).json({ error: "No se ha proporcionado el archivo INE" });
        }

        const ineFile = files.ine[0];

        if (ineFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: "El archivo INE debe ser de tipo PDF" });
        }

        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);
        fs.writeFileSync(ineFilePath, ineFile.buffer, 'binary');

        res.status(200).json({ message: "Archivo INE reemplazado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al reemplazar archivo INE" });
    }
};

export const ReplaceConstancia = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user_id;
        const files = req.files;

        if (!files || !('constancia' in files)) {
            return res.status(400).json({ error: "No se ha proporcionado el archivo Constancia" });
        }

        const constanciaFile = files.constancia[0];

        if (constanciaFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: "El archivo Constancia debe ser de tipo PDF" });
        }

        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);
        fs.writeFileSync(constanciaFilePath, constanciaFile.buffer, 'binary');

        res.status(200).json({ message: "Archivo Constancia reemplazado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al reemplazar archivo Constancia" });
    }
};

export const DetectarArchivosAlmacenados = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const ineFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `INE_${userId}.pdf`);
        const constanciaFilePath = path.join("C:\\Users\\51-09794\\Desktop\\ArchivosProyectos", `Constancia_${userId}.pdf`);

        const archivosAlmacenados = {
            ine: fs.existsSync(ineFilePath),
            constancia: fs.existsSync(constanciaFilePath),
        };

        res.status(200).json(archivosAlmacenados);
    } catch (error) {
        res.status(500).json({ error: "Error al detectar archivos almacenados" });
    }
};

export const Redireccion = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const proveedor = await proveedorRepository.findOne({
            where: {
                user_id: userId
            }
        });

        const proveedorExists = !!proveedor;

        res.status(200).json({ proveedorExists });
    } catch (error) {
        res.status(500).json({ error: "Error al verificar la existencia del proveedor" });
    }
};


