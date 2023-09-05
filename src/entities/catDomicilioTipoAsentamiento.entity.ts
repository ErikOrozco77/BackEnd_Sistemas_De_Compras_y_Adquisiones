import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatDomicilioTipoAsentamiento {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
