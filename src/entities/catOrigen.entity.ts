import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatOrigen {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
