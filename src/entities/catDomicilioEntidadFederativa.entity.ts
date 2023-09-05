import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatDomicilioEntidadFederativa {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
