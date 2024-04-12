import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from "typeorm";
import { Concurso } from "./concurso.entity";
import { Proveedor } from "./proveedor.entity";

@Entity()
export class CatProveedoresConcursantes {
    @PrimaryColumn()
    id_concurso!: number;

    @PrimaryColumn()
    id_proveedor!: number;


    

    @ManyToOne(() => Concurso, { eager: true })
    @JoinColumn({ name: "id_concurso" })
    concurso!: Concurso;

    @ManyToOne(() => Proveedor, { eager: true })
    @JoinColumn({ name: "id_proveedor" })
    proveedor!: Proveedor;

}
