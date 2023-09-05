import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatDomicilioVialidad {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
