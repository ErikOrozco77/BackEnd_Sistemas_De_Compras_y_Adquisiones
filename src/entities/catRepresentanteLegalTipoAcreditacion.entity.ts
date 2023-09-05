import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatRepresentanteLegalTipoAcreditacion {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    descripcion!: string;
}
