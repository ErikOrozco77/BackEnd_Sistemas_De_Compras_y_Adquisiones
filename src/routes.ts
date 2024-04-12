import { Router } from "express";
import { DetectarArchivosAlmacenados, GetConstanciaByAdmin, GetConstanciaInfoByUserId, GetINEByAdmin, GetINEInfoByUserId, GetProveedorByUserId, Redireccion, RegisterProveedor, ReplaceConstancia, ReplaceINE, UpdateProveedor, UploadFiles } from "./controller/supplier.controller";
import { AuthenticatedUser, Login, Logout, Refresh, Register, registerPassword, requestPasswordReset, resetPassword, } from "./controller/auth.controller";
import { CheckUser } from "./controller/user.controller";
import { getcatSexoList } from "./controller/catSexo.controller";
import { getcatRepresentanteLegalTipoAcreditacionList } from "./controller/catRepresentanteLegalTipoAcreditacion.controller";
import { getcatRealizaSubcontratacionesList } from "./controller/catRealizaSubContrataciones.controller";
import { getcatOrigenRepositoryList } from "./controller/catOrigen.controller";
import { getcatEntidadFederativaList } from "./controller/catEntidadFederativa.controller";
import { getcatDomicilioVialidadList } from "./controller/catDomicilioViabilidad.controller";
import { getcatDomicilioTipoAsentamientoList } from "./controller/catDomicilioTipoAsentamiento.controller";
import { getcatDomicilioEntidadFederativaList } from "./controller/catDomicilioEntidadFederativa.controller";
import { DownloadProveedoresExcel, GetAllProveedores } from "./controller/admin.controller";
import { getcatGiroList } from "./controller/catGiro.controller";
import { DescargarInvitacion, GetActiveConcursos, GetProveedoresConcursantes, RegisterConcurso, RegistrarGanador, SeleccionarProveedores, buscarConcursos, buscarConcursosPorFecha, desactivarConcurso, getConcursoPorId, modificarGanador, obtenerConcursosDelProveedor, updateConcurso } from "./controller/Concurso.controller";


export const routes = (router: Router) => {

    //Rutas de inicio
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/user", AuthenticatedUser);
    router.post("/api/refresh", Refresh);
    router.post("/api/logout", Logout);
    router.post('/api/register-password/:token', registerPassword);
    router.get("/api/users/check/:token", CheckUser);

    //Rutas de Proveedor
    router.post("/api/registerProveedor", RegisterProveedor);
    router.put("/api/updateProveedor", UpdateProveedor);
    router.post("/api/upload-files", UploadFiles);
    router.get('/api/catsexo', getcatSexoList);
    router.get('/api/catgiro', getcatGiroList);
    router.get('/api/catrepresentantelegaltipoAcreditacion', getcatRepresentanteLegalTipoAcreditacionList);
    router.get('/api/catrealizasubcontrataciones', getcatRealizaSubcontratacionesList);
    router.get('/api/catorigen', getcatOrigenRepositoryList);
    router.get('/api/catentidadfederativa', getcatEntidadFederativaList);
    router.get('/api/catdomiciliovialidad', getcatDomicilioVialidadList);
    router.get('/api/catdomiciliotipoasentamiento', getcatDomicilioTipoAsentamientoList);
    router.get('/api/catdomicilioentidadfederativa', getcatDomicilioEntidadFederativaList);
    router.get('/api/getProveedorByUserId/:userId', GetProveedorByUserId);
    router.get('/api/get-ine/:userId', GetINEByAdmin);
    router.get('/api/get-constancia/:userId', GetConstanciaByAdmin);

    //Rutas de admin
    router.get('/api/admin-mode', GetAllProveedores);
    router.get('/api/downloadProveedoresExcel', DownloadProveedoresExcel);
    router.post("/api/upload-files", UploadFiles);
    router.get('/api/download-ine/:userId', GetINEInfoByUserId);
    router.get('/api/download-constancia/:userId', GetConstanciaInfoByUserId);
    router.post('/api/replace-ine/:userId', ReplaceINE);
    router.post('/api/replace-constancia/:userId', ReplaceConstancia);
    router.get("/api/detectar-archivos-almacenados/:userId", DetectarArchivosAlmacenados);
    router.get('/api/redireccion/:userId', Redireccion);
    router.post('/api/registrarConcurso', RegisterConcurso);
    router.post('/api/seleccionDeProveedores', SeleccionarProveedores);
    router.get('/api/invitaciones/:id_concurso/:id_proveedor', DescargarInvitacion);
    router.get('/api/concursos-proveedor/:id_proveedor', obtenerConcursosDelProveedor);
    router.get('/api/ListaDeConcurso', GetActiveConcursos);
    router.put('/api/updateConcurso/:id', updateConcurso);
    router.get('/api/concurso/:id', getConcursoPorId);
    router.put('/api/desactivar/:id', desactivarConcurso);
    router.post('/api/registrarGanador', RegistrarGanador);
    router.put('/api/concursos/:id/ganador', modificarGanador);
    router.get('/api/concursos/:id_concurso/proveedores', GetProveedoresConcursantes);
    router.get('/concursos/buscar', buscarConcursos);
    router.get('/api/buscar-por-fecha', buscarConcursosPorFecha);


    router.post("/api/reset/request", requestPasswordReset); // Solicitar restablecimiento de contraseña
    router.post("/api/new-password/:token", resetPassword);
}