import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entities/proveedor.entity";
import * as exceljs from 'exceljs';
import { Concurso } from "../entities/concurso.entity";
const concursoRepository = AppDataSource.getRepository(Concurso);
const proveedorRepository = AppDataSource.getRepository(Proveedor);

export const GetAllProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await proveedorRepository.find();
        res.status(200).send({
            message: "Lista de proveedores",
            data: proveedores,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al obtener la lista de proveedores",
            error: error,
        });
    }
};

export const DownloadProveedoresExcel = async (req: Request, res: Response) => {
    try {
        const proveedores = await proveedorRepository.find({ relations: ['CatSexo', 'CatOrigen', 'CatEntidadFederativa', 'CatRealizaSubcontrataciones', 'CatDomicilioVialidad', 'CatDomicilioTipoAsentamiento', 'CatDomicilioEntidadFederativa', 'CatRepresentanteLegalTipoAcreditacion', 'CatGiro'] });
        const concursosActivos = await concursoRepository.find({ where: { isActive: true }, relations: ['proveedorGanador'] });
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Proveedores');
        const worksheetConcursos = workbook.addWorksheet('Concursos');
        const columnHeaders = ['Id', 'Nombre(s)', 'Primer Apellido', 'Segundo Apellido', 'razonSocial', 'Estratificacion', 'Pais de Origen', 'RFC', 'Actividad Economica', 'Domicilio', 'N° Exterior', 'N° Interior'
            , 'Nombre Asentamiento', 'Clave de Localidad', 'Nombre Localidad', ' Clave de Municipio', 'Nombre del Municipio', 'Clave de Entidad', 'Codigo Postal', ' Pais Extranjero'
            , ' Ciudad Extranjera', ' Calle extranjera', 'Numero extranjero', 'Nombre del Representante Legal', 'Primer Apellido de Representante Legal', 'Segundo Apellido de Representante Legal'
            , 'Telefono del Representante Legal', 'Correo del Representante Legal', 'Website', 'Telefono', 'Sexo', 'Origen', 'Entidad Federativa', 'Realiza Subcontrataciones', 'Domicilio Vialidad'
            , 'Domicilio TipoAsentamiento', 'Domicilio Entidad Federativa', 'Representante Legal Tipo Acreditacion', 'Giro'];
        worksheet.addRow(columnHeaders);
        proveedores.forEach((proveedor) => {
            const row = [
                proveedor.id,
                proveedor.nombre,
                proveedor.primerApellido,
                proveedor.segundoApellido,
                proveedor.razonSocial,
                proveedor.estratificacion,
                proveedor.paisOrigen,
                proveedor.rfc,
                proveedor.actividadEconomica,
                proveedor.domicilioNombre,
                proveedor.domicilioNumeroExterior,
                proveedor.domicilioNumeroInterior,
                proveedor.domicilioNombreAsentamiento,
                proveedor.domicilioClaveLocalidad,
                proveedor.domicilioNombreLocalidad,
                proveedor.domicilioClaveMunicipio,
                proveedor.domicilioNombreMunicipio,
                proveedor.domicilioClaveEntidad,
                proveedor.domicilioCP,
                proveedor.extranjeroPais,
                proveedor.extranjeroCiudad,
                proveedor.extranjeroCalle,
                proveedor.extranjeroNumero,
                proveedor.representanteLegalNombre,
                proveedor.representanteLegalPrimerApellido,
                proveedor.representanteLegalSegundoApellido,
                proveedor.representanteLegalTelefono,
                proveedor.representanteLegalMail,
                proveedor.website,
                proveedor.telefono,
                proveedor.CatSexo ? proveedor.CatSexo.descripcion : null,
                proveedor.CatOrigen ? proveedor.CatOrigen.descripcion : null,
                proveedor.CatEntidadFederativa ? proveedor.CatEntidadFederativa.descripcion : null,
                proveedor.CatRealizaSubcontrataciones ? proveedor.CatRealizaSubcontrataciones.descripcion : null,
                proveedor.CatDomicilioVialidad ? proveedor.CatDomicilioVialidad.descripcion : null,
                proveedor.CatDomicilioTipoAsentamiento ? proveedor.CatDomicilioTipoAsentamiento.descripcion : null,
                proveedor.CatDomicilioEntidadFederativa ? proveedor.CatDomicilioEntidadFederativa.descripcion : null,
                proveedor.CatRepresentanteLegalTipoAcreditacion ? proveedor.CatRepresentanteLegalTipoAcreditacion.descripcion : null,
                proveedor.CatGiro ? proveedor.CatGiro.descripcion : null,
            ];
            worksheet.addRow(row);
        });

        const columnHeadersConcursos = ['Id', 'Id Concurso', 'Nombre', 'Fecha de Entrega de Documentos', 'Fecha de Expedicion', 'Proveedor Ganador'];
        worksheetConcursos.addRow(columnHeadersConcursos);

        concursosActivos.forEach((concurso) => {
            let proveedorNombre = '';
            if (concurso.proveedorGanador && concurso.proveedorGanador.nombre) {
                proveedorNombre = `${concurso.proveedorGanador.nombre} ${concurso.proveedorGanador.primerApellido} ${concurso.proveedorGanador.segundoApellido}`;
            }
            const row = [concurso.id, concurso.id_concurso, concurso.nombreDeConcurso, concurso.fechaEntregadeDocumentos, concurso.fechaExpedicion, proveedorNombre];
            worksheetConcursos.addRow(row);
        });



        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=proveedores.xlsx');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al descargar el archivo Excel de proveedores",
            error: error,
        });
    }
};
