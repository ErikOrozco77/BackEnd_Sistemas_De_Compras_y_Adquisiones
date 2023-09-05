import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatRealizaSubcontrataciones {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
