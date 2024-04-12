import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entities/proveedor.entity";
import { Concurso } from "../entities/concurso.entity";
import { CatProveedoresConcursantes } from "../entities/catProveedoresConcursantes.entity";
import * as nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

const concursoRepository = AppDataSource.getRepository(Concurso);
const proveedorRepository = AppDataSource.getRepository(Proveedor);
const catProveedoresConcursantesRepository = AppDataSource.getRepository(CatProveedoresConcursantes);

export const RegisterConcurso = async (req: Request, res: Response) => {
    try {
        const {
            id_concurso,
            nombreDeConcurso,
            fechaEntregadeDocumentos,
            fechaExpedicion,
            proveedorGanador
        } = req.body;
        const nuevoConcurso = new Concurso();
        nuevoConcurso.id_concurso = id_concurso
        nuevoConcurso.nombreDeConcurso = nombreDeConcurso;
        nuevoConcurso.fechaEntregadeDocumentos = fechaEntregadeDocumentos;
        nuevoConcurso.fechaExpedicion = fechaExpedicion;
        nuevoConcurso.isActive = true;

        console.log("Datos recibidos en el servidor:", req.body);

        if (proveedorGanador) {
            const proveedorGanadorInstance = await proveedorRepository.findOne({
                where: { id: proveedorGanador.id },
            });

            if (proveedorGanadorInstance) {
                nuevoConcurso.proveedorGanador = proveedorGanadorInstance;
            } else {
                return res.status(404).json({ error: "Proveedor ganador no encontrado" });
            }
        }
        await concursoRepository.save(nuevoConcurso);

        res.status(201).json({ message: "Concurso registrado con éxito" });
        console.log("Datos recibidos en el servidor:", req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el concurso" });
    }
};

export const GetActiveConcursos = async (req: Request, res: Response) => {
    try {
        const concursosActivos = await concursoRepository.find({
            where: { isActive: true },
        });
        res.status(200).json(concursosActivos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los concursos activos" });
    }
};

export const updateConcurso = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const {
            id_concurso,
            nombreDeConcurso,
            fechaEntregadeDocumentos,
            fechaExpedicion,
        } = req.body;
        const concursoExistente = await concursoRepository.findOne({ where: { id } });

        if (!concursoExistente) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }
        concursoExistente.id_concurso = id_concurso;
        concursoExistente.nombreDeConcurso = nombreDeConcurso;
        concursoExistente.fechaEntregadeDocumentos = fechaEntregadeDocumentos;
        concursoExistente.fechaExpedicion = fechaExpedicion;
        await concursoRepository.save(concursoExistente);

        res.status(200).json({ message: 'Concurso actualizado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el concurso' });
    }
};

export const getConcursoPorId = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id; // Convertir el id a número

        // Buscar el concurso por su ID
        const concursoExistente = await concursoRepository.findOne({ where: { id } });
        const concurso = await concursoRepository.findOne({ where: { id } });

        if (!concurso) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }

        // Puedes ajustar el formato de la respuesta según tus necesidades
        res.status(200).json(concurso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el concurso por ID' });
    }
};

export const desactivarConcurso = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;

        const concursoExistente = await concursoRepository.findOne({ where: { id } });

        if (!concursoExistente) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }
        concursoExistente.isActive = false;
        await concursoRepository.save(concursoExistente);

        res.status(200).json({ message: 'Concurso desactivado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al desactivar el concurso' });
    }
};

export const RegistrarGanador = async (req: Request, res: Response) => {
    try {
        const { id_concurso, proveedor_id } = req.body;
        const concurso = await concursoRepository.findOne({ where: { id: id_concurso } });

        if (!concurso) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }
        const proveedorGanador = await proveedorRepository.findOne({ where: { id: proveedor_id } });

        if (!proveedorGanador) {
            return res.status(404).json({ error: 'Proveedor ganador no encontrado' });
        }
        concurso.proveedorGanador = proveedorGanador;
        await concursoRepository.save(concurso);

        res.status(201).json({ message: 'Proveedor ganador registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el proveedor ganador' });
    }
};

export const modificarGanador = async (req: Request, res: Response) => {
    try {
        const concursoId: number = +req.params.id;
        const { proveedorId } = req.body;
        const concurso = await concursoRepository.findOne({ where: { id: concursoId } });

        if (!concurso) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }
        const proveedorGanador = await proveedorRepository.findOne({ where: { id: proveedorId } });

        if (!proveedorGanador) {
            return res.status(404).json({ error: 'Proveedor ganador no encontrado' });
        }
        concurso.proveedorGanador = proveedorGanador;
        await concursoRepository.save(concurso);

        res.status(200).json({ message: 'Proveedor ganador modificado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar el proveedor ganador' });
    }
};

export const GetProveedoresConcursantes = async (req: Request, res: Response) => {
    try {
        const { id_concurso } = req.params;
        const proveedoresConcursantes = await catProveedoresConcursantesRepository.find({
            where: { id_concurso: parseInt(id_concurso) },
            relations: ["proveedor"]
        });

        if (!proveedoresConcursantes) {
            return res.status(404).json({ error: 'No se encontraron proveedores concursantes para este concurso' });
        }

        res.status(200).json(proveedoresConcursantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener proveedores concursantes' });
    }
};

export const buscarConcursos = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const concursosEncontrados = await concursoRepository.createQueryBuilder("concurso")
            .where("concurso.id_concurso LIKE :query OR concurso.nombreDeConcurso LIKE :query", { query: `%${query}%` })
            .getMany();

        if (!concursosEncontrados || concursosEncontrados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron concursos que coincidan con la búsqueda' });
        }

        res.status(200).json(concursosEncontrados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar concursos' });
    }
};

export const buscarConcursosPorFecha = async (req: Request, res: Response) => {
    try {
        const { fechaExpedicion } = req.query;
        if (!fechaExpedicion || typeof fechaExpedicion !== 'string') {
            return res.status(400).json({ error: 'Se requiere una fecha de expedición válida en el query string' });
        }
        const fechaExpedicionDate = new Date(fechaExpedicion);
        const concursosEncontrados = await concursoRepository.createQueryBuilder("concurso")
            .where("concurso.fechaExpedicion = :fechaExpedicion OR concurso.fechaEntregadeDocumentos = :fechaExpedicion", { fechaExpedicion: fechaExpedicionDate })
            .getMany()
        if (!concursosEncontrados || concursosEncontrados.length === 0) {
            return res.status(404).json({ error: 'No se encontraron concursos que coincidan con la fecha proporcionada' });
        }

        res.status(200).json(concursosEncontrados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar concursos por fecha' });
    }
};

export const obtenerConcursosDelProveedor = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id_proveedor, 10);
        const proveedor = await proveedorRepository.findOne({
            where: { id: userId }
        });

        if (!proveedor) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }
        const registros = await catProveedoresConcursantesRepository.find({
            where: { proveedor: proveedor },
            relations: ["concurso"] 
        });
        const concursos = registros.map(registro => {
            const concurso = registro.concurso;
            return {
                id: concurso.id,
                id_concurso: concurso.id_concurso,
                nombreDeConcurso: concurso.nombreDeConcurso,
                fechaEntregadeDocumentos: concurso.fechaEntregadeDocumentos,
                fechaExpedicion: concurso.fechaExpedicion,
                ganador_id: concurso.proveedorGanador

            };
        });

        res.status(200).json({ proveedor, concursos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener datos prellenados" });
    }
};

export const DescargarInvitacion = async (req: Request, res: Response) => {
    try {
        const { id_concurso, id_proveedor } = req.params;
        const concursoId = parseInt(id_concurso, 10);
        const proveedorId = parseInt(id_proveedor, 10);

        const proveedorConcursante = await catProveedoresConcursantesRepository.findOne({ where: { id_concurso: concursoId, id_proveedor: proveedorId } });

        if (!proveedorConcursante) {
            return res.status(404).json({ error: 'Proveedor no registrado como concursante' });
        }

        const concurso = await concursoRepository.findOne({ where: { id: concursoId } });
        if (!concurso) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }

        const proveedor = await proveedorRepository.findOne({ where: { id: proveedorId } });
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        const doc = new PDFDocument();
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const fechaEntregaDocumentos = new Date(concurso.fechaEntregadeDocumentos);
        const fechaExpedicion = new Date(concurso.fechaExpedicion);

        const diaEntrega = fechaEntregaDocumentos.getUTCDate();
        const mesEntrega = meses[fechaEntregaDocumentos.getUTCMonth()];
        const anioEntrega = fechaEntregaDocumentos.getUTCFullYear();
        const fechaEntregaFormateada = `${diaEntrega} de ${mesEntrega} del ${anioEntrega}`;

        const dia = fechaExpedicion.getUTCDate();
        const mes = meses[fechaExpedicion.getUTCMonth()];
        const anio = fechaExpedicion.getUTCFullYear();
        const fechaFormateada = `${dia} de ${mes} del ${anio}`;


        const imagePath = 'logopjc.jpg';
        doc.image(imagePath, 10, 10, { width: 150 });


        const topMargin = 50;
        const maxWidth = 500;
        doc.text("Concurso", { width: 490, align: 'right' });
        doc.text(concurso.id_concurso, { width: maxWidth, align: 'right' });
        doc.fontSize(10);


        doc.text('PODER JUDICIAL DEL ESTADO DE COLIMA.', { align: 'center' })
            .text('SUPREMO TRIBUNAL DE JUSTICIA.', { align: 'center' })
            .text(' ', { align: 'center', lineGap: 20 })
            .text(`${proveedor.representanteLegalNombre} ${proveedor.representanteLegalPrimerApellido} ${proveedor.representanteLegalSegundoApellido}`, { align: 'left' })
            .text('PROVEEDOR DEL PODER JUDICIAL.', { align: 'left' })
            .text('P R E S E N T E.-', { align: 'left' })
            .text('Mediante este conducto nos permitimos extender a usted una atenta invitación a participar en el concurso por invitación a cuando menos tres personas, paquete ' + concurso.id_concurso + ' que efectuará el Supremo Tribunal de Justicia para la adquisición de' + ' ' + '"' + concurso.nombreDeConcurso + '"' + ', para las oficinas del Poder Judicial del Estado de Colima, cuyas características y demás especificaciones técnicas se detallan en el anexo de la presente invitación.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('Para tal efecto agradeceremos a usted se sirva presentar su oferta, con objeto de incluirla en el proceso de evaluación que se llevará a cabo para seleccionar a aquella que reúna las mejores condiciones legales, técnicas y económicas; y que, por consiguiente, presente la opción más adecuada, misma que servirá de base para la adjudicación de la Compra - Venta correspondiente.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('Al respecto, cabe destacar que el Supremo Tribunal de Justicia adjudicará los bienes que nos ocupa a la propuesta que garantice a esta dependencia las mejores condiciones de compra en cuanto a calidad, precio y demás circunstancias pertinentes.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('Debido a lo anterior y con objeto de garantizar un proceso de evaluación y selección transparente y claro, hemos de agradecer a usted tenga a bien observar en la elaboración, las siguientes bases:', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('1.- La oferta deberá entregarse debidamente requisitada, firmada y sellada por el Proveedor si es persona física y si es Sociedad Anónima por el representante legal, en dos sobres lacrados, uno con la propuesta técnica y otro con la económica, antes de las 15:00 horas del día ' + fechaEntregaFormateada + ', en la Oficialía Mayor del Supremo Tribunal de Justicia, ubicado en Calzada Galván y Aldama S/N, Segundo piso, Colonia Centro en esta Ciudad, teléfonos 312-690-65-34, 312-690-65-35, 312-690-65-36 Ext. 2263, Directo 312-690-65-40.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('2.- El pago de los bienes adquiridos se efectuará un mes después de verificarse la aceptación de los mimos a entera satisfacción del Supremo Tribunal de Justicia, previa presentación de la factura correspondiente que deberá reunir todos los requisitos fiscales aplicables.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('3.- Los bienes se adjudicarán por renglón a aquella que garantice las mejores condiciones en cuanto a calidad, oportunidad, precio y demás circunstancias pertinentes. ', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('LA PROPUESTA TÉCNICA deberá elaborarse en papel membretado de la empresa presentándola en sobre cerrado y lacrado dirigido al comité de Adquisiciones, Arrendamientos y Servicios del Supremo Tribunal de Justicia con domicilio en Calzada Galván y Aldama S/N, colonia centro en esta ciudad, indicando nombre, dirección y teléfono del participante, así como el número de Paquete del Concurso' + concurso.id_concurso + ' en el que participa conteniendo los siguientes puntos:', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('1.- Manifestar por escrito que la vigencia de la cotización de los servicios ofertados no será inferior a 15 días contados a partir de la entrega de los sobres de cotización.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('2.-Manifestar por escrito que los bienes ofertados son nuevos y se garantizan contra mala calidad de los materiales utilizados en su fabricación, mano de obra, vicios ocultos, etc.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 2 })
            .text('"2024, AÑO DEL BICENTENARIO DE LA CREACIÓN DEL TERRITORIO FEDERAL DE COLIMA"', { align: 'center' })
            .text('3.- Manifestar por escrito que la entrega de los bienes ofertados no será superior a 15 días naturales contados a partir de recibida la orden de compra y en caso de no cumplir con este requisito se le impondrá una sanción del 5% del importe de los bienes que le faltó por entregar.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('4.- Manifestar por escrito que la propuesta se cotiza en moneda mexicana.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('5.- Manifestar por escrito que no se encuentran en los supuestos de lo que establece el artículo 38 de la Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público del Estado de Colima.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('6.- Anexar copia de la constancia de situación fiscal.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('7.- Anexar opinión de cumplimiento de obligaciones fiscales estatal y federal positiva, no mayor a 30 días. ', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('8.- En caso de ser persona moral, anexar copia del acta constitutiva con la modificación que coincida con el nombramiento del representante legal actual.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('9.- Anexar comprobante de domicilio.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('10.- Anexar copia de la credencia de elector del propietario, en el caso de las personas físicas, y/o del representante legal o del gerente de la tienda, en el caso de personas morales.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('11.- Se anexará la descripción de los bienes ofertados sin precio, conteniendo cantidad, descripción y demás especificaciones técnicas de los bienes a ofertar según el anexo, sin precios.', { align: 'justify' })
            .text('El sobre de la propuesta económica deberá contener.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('LA PROPUESTA ECONÓMICA deberá elaborarse en papel membretado de la empresa presentándola en sobre cerrado y lacrado dirigido al comité de Adquisiciones, Arrendamientos y Servicios del Supremo Tribunal de Justicia con domicilio en Calzada Galván y Aldama S/N, colonia centro en esta ciudad, indicando nombre, dirección y teléfono del participante, así como el número de Paquete del Concurso ' + concurso.id_concurso + ' en el que participa, debiendo contener la cantidad y demás especificaciones técnicas según el anexo, así como indicar importe con IVA incluido en cada renglón solicitado (precio unitario con IVA incluido) y total de todos los bienes solicitados, de lo contrario no se considerará dicha oferta.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('Sin otro particular, quedo a sus órdenes y agradeciendo su participación.', { align: 'justify' })
            .text(' ', { align: 'center', lineGap: 0.5 })
            .text('A T E N T A M E N T E.', { align: 'center' })
            .text('COLIMA, COL. ' + fechaFormateada, { align: 'center' })
            .text(' ', { align: 'center', lineGap: 20 })
            .text(' ', { align: 'center', lineGap: 20 })

        const imageFirma = "firma.png";
        const imageWidth = 120;
        const pageWidth = doc.page.width;
        const imageX = (pageWidth - imageWidth) / 2;
        const imageY = doc.y + -60;
        doc.image(imageFirma, imageX, imageY, { width: imageWidth })
            .text('C.P. ROBERTO MÁRQUEZ BARRETO.', { align: 'center' })
            .text('PRESIDENTE DEL COMITÉ DE ADQUISICIONES, ARRENDAMIENTOS', { align: 'center' })
            .text('Y SERVICIOS DEL PODER JUDICIAL DEL ESTADO.', { align: 'center' })
            .text(' ', { align: 'center', lineGap: 80 })
        doc.font('Helvetica').fontSize(10).text('"2024, AÑO DEL BICENTENARIO DE LA CREACIÓN DEL TERRITORIO FEDERAL DE COLIMA"', { align: 'center' });
        doc.end();

        res.setHeader('Content-Disposition', `attachment; filename=invitacion_${concursoId}_${proveedorId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar la invitación' });
    }
};

export const SeleccionarProveedores = async (req: Request, res: Response) => {
    
    try {
        const { id_concurso, proveedoresSeleccionados } = req.body;
        const concurso = await concursoRepository.findOne({ where: { id: id_concurso } });

        if (!concurso) {
            return res.status(404).json({ error: 'Concurso no encontrado' });
        }

        if (!proveedoresSeleccionados || proveedoresSeleccionados.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado proveedores seleccionados' });
        }

        const proveedores = await proveedorRepository.findByIds(proveedoresSeleccionados);

        if (proveedores.length !== proveedoresSeleccionados.length) {
            return res.status(404).json({ error: 'Alguno de los proveedores seleccionados no existe' });
        }
        let emailsSent = 0;
        for (const proveedor of proveedores) {
            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];

            const fechaEntregaDocumentos = new Date(concurso.fechaEntregadeDocumentos);
            const fechaExpedicion = new Date(concurso.fechaExpedicion);

            const diaEntrega = fechaEntregaDocumentos.getUTCDate();
            const mesEntrega = meses[fechaEntregaDocumentos.getUTCMonth()];
            const anioEntrega = fechaEntregaDocumentos.getUTCFullYear();
            const fechaEntregaFormateada = `${diaEntrega} de ${mesEntrega} del ${anioEntrega}`;

            const dia = fechaExpedicion.getUTCDate();
            const mes = meses[fechaExpedicion.getUTCMonth()];
            const anio = fechaExpedicion.getUTCFullYear();
            const fechaFormateada = `${dia} de ${mes} del ${anio}`;



            const doc = new PDFDocument();
            const buffers: Uint8Array[] = [];
            doc.on('data', (buffer) => buffers.push(buffer));
            const imagePath = 'logopjc.jpg';
            doc.image(imagePath, 10, 10, { width: 150 });

            const topMargin = 50;
            const maxWidth = 500;
            doc.text("Concurso", { width: 490, align: 'right' });
            doc.text(concurso.id_concurso, { width: maxWidth, align: 'right' });
            doc.fontSize(10);

            doc.text('PODER JUDICIAL DEL ESTADO DE COLIMA.', { align: 'center' })
                .text('SUPREMO TRIBUNAL DE JUSTICIA.', { align: 'center' })
                .text(' ', { align: 'center', lineGap: 20 })
                .text(`${proveedor.representanteLegalNombre} ${proveedor.representanteLegalPrimerApellido} ${proveedor.representanteLegalSegundoApellido}`, { align: 'left' })
                .text('PROVEEDOR DEL PODER JUDICIAL.', { align: 'left' })
                .text('P R E S E N T E.-', { align: 'left' })
                .text('Mediante este conducto nos permitimos extender a usted una atenta invitación a participar en el concurso por invitación a cuando menos tres personas, paquete ' + concurso.id_concurso + ' que efectuará el Supremo Tribunal de Justicia para la adquisición de' + ' ' + '"' + concurso.nombreDeConcurso + '"' + ', para las oficinas del Poder Judicial del Estado de Colima, cuyas características y demás especificaciones técnicas se detallan en el anexo de la presente invitación.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('Para tal efecto agradeceremos a usted se sirva presentar su oferta, con objeto de incluirla en el proceso de evaluación que se llevará a cabo para seleccionar a aquella que reúna las mejores condiciones legales, técnicas y económicas; y que, por consiguiente, presente la opción más adecuada, misma que servirá de base para la adjudicación de la Compra - Venta correspondiente.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('Al respecto, cabe destacar que el Supremo Tribunal de Justicia adjudicará los bienes que nos ocupa a la propuesta que garantice a esta dependencia las mejores condiciones de compra en cuanto a calidad, precio y demás circunstancias pertinentes.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('Debido a lo anterior y con objeto de garantizar un proceso de evaluación y selección transparente y claro, hemos de agradecer a usted tenga a bien observar en la elaboración, las siguientes bases:', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('1.- La oferta deberá entregarse debidamente requisitada, firmada y sellada por el Proveedor si es persona física y si es Sociedad Anónima por el representante legal, en dos sobres lacrados, uno con la propuesta técnica y otro con la económica, antes de las 15:00 horas del día ' + fechaEntregaFormateada + ', en la Oficialía Mayor del Supremo Tribunal de Justicia, ubicado en Calzada Galván y Aldama S/N, Segundo piso, Colonia Centro en esta Ciudad, teléfonos 312-690-65-34, 312-690-65-35, 312-690-65-36 Ext. 2263, Directo 312-690-65-40.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('2.- El pago de los bienes adquiridos se efectuará un mes después de verificarse la aceptación de los mimos a entera satisfacción del Supremo Tribunal de Justicia, previa presentación de la factura correspondiente que deberá reunir todos los requisitos fiscales aplicables.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('3.- Los bienes se adjudicarán por renglón a aquella que garantice las mejores condiciones en cuanto a calidad, oportunidad, precio y demás circunstancias pertinentes. ', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('LA PROPUESTA TÉCNICA deberá elaborarse en papel membretado de la empresa presentándola en sobre cerrado y lacrado dirigido al comité de Adquisiciones, Arrendamientos y Servicios del Supremo Tribunal de Justicia con domicilio en Calzada Galván y Aldama S/N, colonia centro en esta ciudad, indicando nombre, dirección y teléfono del participante, así como el número de Paquete del Concurso' + concurso.id_concurso + ' en el que participa conteniendo los siguientes puntos:', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 1 })
                .text('1.- Manifestar por escrito que la vigencia de la cotización de los servicios ofertados no será inferior a 15 días contados a partir de la entrega de los sobres de cotización.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('2.-Manifestar por escrito que los bienes ofertados son nuevos y se garantizan contra mala calidad de los materiales utilizados en su fabricación, mano de obra, vicios ocultos, etc.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 4 })
                .text('"2024, AÑO DEL BICENTENARIO DE LA CREACIÓN DEL TERRITORIO FEDERAL DE COLIMA"', { align: 'center' })
                .text(' ', { align: 'center', lineGap: 2 })
                .text('3.- Manifestar por escrito que la entrega de los bienes ofertados no será superior a 15 días naturales contados a partir de recibida la orden de compra y en caso de no cumplir con este requisito se le impondrá una sanción del 5% del importe de los bienes que le faltó por entregar.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('4.- Manifestar por escrito que la propuesta se cotiza en moneda mexicana.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('5.- Manifestar por escrito que no se encuentran en los supuestos de lo que establece el artículo 38 de la Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público del Estado de Colima.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('6.- Anexar copia de la constancia de situación fiscal.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('7.- Anexar opinión de cumplimiento de obligaciones fiscales estatal y federal positiva, no mayor a 30 días. ', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('8.- En caso de ser persona moral, anexar copia del acta constitutiva con la modificación que coincida con el nombramiento del representante legal actual.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('9.- Anexar comprobante de domicilio.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('10.- Anexar copia de la credencia de elector del propietario, en el caso de las personas físicas, y/o del representante legal o del gerente de la tienda, en el caso de personas morales.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('11.- Se anexará la descripción de los bienes ofertados sin precio, conteniendo cantidad, descripción y demás especificaciones técnicas de los bienes a ofertar según el anexo, sin precios.', { align: 'justify' })
                .text('El sobre de la propuesta económica deberá contener.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('LA PROPUESTA ECONÓMICA deberá elaborarse en papel membretado de la empresa presentándola en sobre cerrado y lacrado dirigido al comité de Adquisiciones, Arrendamientos y Servicios del Supremo Tribunal de Justicia con domicilio en Calzada Galván y Aldama S/N, colonia centro en esta ciudad, indicando nombre, dirección y teléfono del participante, así como el número de Paquete del Concurso ' + concurso.id_concurso + ' en el que participa, debiendo contener la cantidad y demás especificaciones técnicas según el anexo, así como indicar importe con IVA incluido en cada renglón solicitado (precio unitario con IVA incluido) y total de todos los bienes solicitados, de lo contrario no se considerará dicha oferta.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('Sin otro particular, quedo a sus órdenes y agradeciendo su participación.', { align: 'justify' })
                .text(' ', { align: 'center', lineGap: 0.5 })
                .text('A T E N T A M E N T E.', { align: 'center' })
                .text('COLIMA, COL. ' + fechaFormateada, { align: 'center' })
                .text(' ', { align: 'center', lineGap: 20 })
                .text(' ', { align: 'center', lineGap: 20 })

            const imageFirma = "firma.png";
            const imageWidth = 120;
            const pageWidth = doc.page.width;
            const imageX = (pageWidth - imageWidth) / 2;
            const imageY = doc.y + -60;

            doc.image(imageFirma, imageX, imageY, { width: imageWidth })
                .text('C.P. ROBERTO MÁRQUEZ BARRETO.', { align: 'center' })
                .text('PRESIDENTE DEL COMITÉ DE ADQUISICIONES, ARRENDAMIENTOS', { align: 'center' })
                .text('Y SERVICIOS DEL PODER JUDICIAL DEL ESTADO.', { align: 'center' })
                .text(' ', { align: 'center', lineGap: 60 })
            doc.font('Helvetica').fontSize(10).text('"2024, AÑO DEL BICENTENARIO DE LA CREACIÓN DEL TERRITORIO FEDERAL DE COLIMA"', { align: 'center' });
            doc.end();

            doc.on('end', async () => {
                const pdfBytes = Buffer.concat(buffers);
                const existeRegistro = await catProveedoresConcursantesRepository.findOne({ where: { id_concurso: id_concurso, id_proveedor: proveedor.id } });
                if (!existeRegistro) {
                    const catProveedoresConcursantes = new CatProveedoresConcursantes();
                    catProveedoresConcursantes.id_concurso = id_concurso;
                    catProveedoresConcursantes.id_proveedor = proveedor.id;
                    try {
                        await catProveedoresConcursantesRepository.save(catProveedoresConcursantes);
                    } catch (error) {
                        console.error('Error al guardar en la base de datos:', error);
                        return res.status(500).json({ error: 'Error al guardar en la base de datos' });
                    }
                } else {
                    console.log('El registro ya existe en la base de datos');
                }
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "orozcoalcarazerik@gmail.com",
                        pass: "hjlg cnuv xjtl csrk",
                    },
                });

                const mailOptions = {
                    from: 'desarrollo_tecnologico@stjcolima.gob.mx',
                    to: proveedor.representanteLegalMail,
                    subject: 'Invitación',
                    text: `Estimado/a ${proveedor.nombre},\n\n` +
                        `Nos complace informarte que has sido seleccionado/a para participar en nuestro concurso para la adquisición de materiales, bienes o servicios, organizado por el Poder Judicial de Colima.\n\n` +
                        `Tu participación es fundamental para garantizar que se tomen decisiones informadas y se adquieran los productos y s necesarios con eficiencia y calidad.\n\n` +
                        `Por favor, confirma tu participación lo antes posible. Si tienes alguna pregunta o necesitas más información sobre el concurso, no dudes en ponerte en contacto con nuestro equipo a través de control_patrimonial@stjcolima.gob.mx o llamando al 3123131301.\n\n` +
                        `Agradecemos de antemano tu interés y compromiso con este proceso de adquisición.\n\n` +
                        `Atentamente,\n` +
                        `COMITÉ DE ADQUISICIONES, ARRENDAMIENTOS Y SERVICIOS DEL PODER JUDICIAL DEL ESTADO.\n`,
                    attachments: [
                        {
                            filename: `invitacion_${concurso.id_concurso}.pdf`,
                            content: pdfBytes
                        }
                    ]
                };
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.error('Error al enviar el correo electrónico:', error);
                        res.status(500).json({ error: 'Error al enviar el correo electrónico' });
                    } else {
                        console.log('Correo electrónico enviado:', info.response);
                        emailsSent++;
                        if (emailsSent === proveedores.length) {
                            try {
                                res.status(201).json({ message: 'Correos electrónicos enviados con éxito' });
                            } catch (error) {
                                console.error('Error al eliminar archivos:', error);
                                res.status(500).json({ error: 'Error al eliminar archivos' });
                            }
                        }
                    }
                });
            }
            )
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al seleccionar proveedores para el concurso' });
    }
};