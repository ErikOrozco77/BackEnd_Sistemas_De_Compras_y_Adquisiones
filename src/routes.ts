import { NextFunction, Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "./entities/user.entity";
import { AppDataSource } from "./data-source";
import { GetConstanciaByUserId, GetINEByUserId, GetProveedorByUserId, RegisterProveedor, UpdateProveedor, UploadFiles} from "./controller/supplier.controller";

import {
    AuthenticatedUser,
    Login,
    Logout,
    Refresh,
    Register,
    registerPassword,
    

} from "./controller/auth.controller";
import { CheckUser } from "./controller/user.controller";
import { Proveedor } from "./entities/proveedor.entity";
import { getcatSexoList } from "./controller/catSexo.controller";
import { getcatRepresentanteLegalTipoAcreditacionList } from "./controller/catRepresentanteLegalTipoAcreditacion.controller";
import { getcatRealizaSubcontratacionesList } from "./controller/catRealizaSubContrataciones.controller";
import { getcatOrigenRepositoryList } from "./controller/catOrigen.controller";
import { getcatEntidadFederativaList } from "./controller/catEntidadFederativa.controller";
import { getcatDomicilioVialidadList } from "./controller/catDomicilioViabilidad.controller";
import { getcatDomicilioTipoAsentamientoList } from "./controller/catDomicilioTipoAsentamiento.controller";
import { getcatDomicilioEntidadFederativaList } from "./controller/catDomicilioEntidadFederativa.controller";
import { GetAllProveedores } from "./controller/admin.controller";


const userRepository = AppDataSource.getRepository(User);
const proveedorRepository = AppDataSource.getRepository(Proveedor);



export const routes = (router: Router) => {
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/user", AuthenticatedUser);
    router.post("/api/refresh", Refresh);
    router.post("/api/logout", Logout);


    router.post('/api/register-password/:token', registerPassword);
    router.get("/api/users/check/:token", CheckUser);
    router.post("/api/registerProveedor", RegisterProveedor);
    router.put("/api/updateProveedor", UpdateProveedor);
    router.post("/api/upload-files", UploadFiles);

    router.get('/api/catsexo',getcatSexoList);
    router.get('/api/catrepresentantelegaltipoAcreditacion',getcatRepresentanteLegalTipoAcreditacionList);
    router.get('/api/catrealizasubcontrataciones', getcatRealizaSubcontratacionesList );
    router.get('/api/catorigen', getcatOrigenRepositoryList );
    router.get('/api/catentidadfederativa',getcatEntidadFederativaList);
    router.get('/api/catdomiciliovialidad',getcatDomicilioVialidadList);
    router.get('/api/catdomiciliotipoasentamiento',getcatDomicilioTipoAsentamientoList);
    router.get('/api/catdomicilioentidadfederativa',getcatDomicilioEntidadFederativaList);
    router.get('/api/getProveedorByUserId/:userId', GetProveedorByUserId);
    
    router.get('/api/get-ine/:userId', GetINEByUserId);
    router.get('/api/get-constancia/:userId', GetConstanciaByUserId);
    
    router.get('/api/admin-mode',GetAllProveedores);

}
