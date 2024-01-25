import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatGiro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
