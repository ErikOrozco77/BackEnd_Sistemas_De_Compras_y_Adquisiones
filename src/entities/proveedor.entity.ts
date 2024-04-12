import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,OneToOne, OneToMany,} from "typeorm";
import { CatSexo } from "./catSexo.entity";
import { CatOrigen } from "./catOrigen.entity";
import { CatEntidadFederativa } from "./catEntidadFederativa.entity";
import { CatRealizaSubcontrataciones } from "./catRealizaSubcontrataciones.entity";
import { CatDomicilioVialidad } from "./catDomicilioVialidad.entity";
import { CatDomicilioTipoAsentamiento } from "./catDomicilioTipoAsentamiento.entity";
import { CatDomicilioEntidadFederativa } from "./catDomicilioEntidadFederativa.entity";
import { CatRepresentanteLegalTipoAcreditacion } from "./catRepresentanteLegalTipoAcreditacion.entity";
import { User } from "./user.entity";
import { CatGiro } from "./catGiro.entity";
import{CatProveedoresConcursantes} from "./catProveedoresConcursantes.entity";

@Entity()
export class Proveedor {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => CatProveedoresConcursantes, (pc) => pc.proveedor)
    catProveedoresConcursantes!: CatProveedoresConcursantes[];

    @Column({ name: "nombre" })
    nombre!: string;

    @Column({ name: "primer_apellido" })
    primerApellido!: string;

    @Column({ name: "segundo_apellido" })
    segundoApellido!: string;

    @ManyToOne(() => CatSexo, { eager: true })
    CatSexo!: CatSexo;

    @ManyToOne(() => CatGiro, { eager: true })
    CatGiro!: CatGiro;

    @Column({ name: "razon_social" })
    razonSocial!: string;

    @Column()
    estratificacion!: string;

    @ManyToOne(() => CatOrigen, { eager: true })
    CatOrigen!: CatOrigen;

    @Column({ name: "pais_origen" })
    paisOrigen!: string;

    @Column()
    rfc!: string;

    @ManyToOne(() => CatEntidadFederativa, { eager: true })
    CatEntidadFederativa!: CatEntidadFederativa;

    @ManyToOne(() => CatRealizaSubcontrataciones, { eager: true })
    CatRealizaSubcontrataciones!: CatRealizaSubcontrataciones;

    @Column({ name: "actividad_economica" })
    actividadEconomica!: string;

    @ManyToOne(() => CatDomicilioVialidad, { eager: true })
    CatDomicilioVialidad!: CatDomicilioVialidad;

    @Column({ name: "domicilio_nombre" })
    domicilioNombre!: string;

    @Column({ name: "domicilio_numero_exterior" })
    domicilioNumeroExterior!: string;

    @Column({ name: "domicilio_numero_interior" })
    domicilioNumeroInterior!: string;

    @ManyToOne(() => CatDomicilioTipoAsentamiento, { eager: true })
    CatDomicilioTipoAsentamiento!: CatDomicilioTipoAsentamiento;

    @Column({ name: "domicilio_nombre_asentamiento" })
    domicilioNombreAsentamiento!: string;

    @Column({ name: "domicilio_clave_localidad" })
    domicilioClaveLocalidad!: string;

    @Column({ name: "domicilio_nombre_localidad" })
    domicilioNombreLocalidad!: string;

    @Column({ name: "domicilio_clave_municipio" })
    domicilioClaveMunicipio!: string;

    @Column({ name: "domicilio_nombre_municipio" })
    domicilioNombreMunicipio!: string;

    @Column({ name: "domicilio_clave_entidad" })
    domicilioClaveEntidad!: string;

    @ManyToOne(() => CatDomicilioEntidadFederativa, { eager: true })
    CatDomicilioEntidadFederativa!: CatDomicilioEntidadFederativa;

    @Column({ name: "domicilio_cp" })
    domicilioCP!: string;

    @Column({ name: "extranjero_pais" })
    extranjeroPais!: string;

    @Column({ name: "extranjero_ciudad" })
    extranjeroCiudad!: string;

    @Column({ name: "extranjero_calle" })
    extranjeroCalle!: string;

    @Column({ name: "extranjero_numero" })
    extranjeroNumero!: string;

    @Column({ name: "representante_legal_nombre" })
    representanteLegalNombre!: string;

    @Column({ name: "representante_legal_primer_apellido" })
    representanteLegalPrimerApellido!: string;

    @Column({ name: "representante_legal_segundo_apellido" })
    representanteLegalSegundoApellido!: string;

    @Column({ name: "representante_legal_telefono" })
    representanteLegalTelefono!: string;

    @Column({ name: "representante_legal_mail" })
    representanteLegalMail!: string;

    @ManyToOne(() => CatRepresentanteLegalTipoAcreditacion, { eager: true })
    CatRepresentanteLegalTipoAcreditacion!: CatRepresentanteLegalTipoAcreditacion;

    @Column()
    website!: string;

    @Column()
    telefono!: string;

    @Column()
    user_id!: number;



}
