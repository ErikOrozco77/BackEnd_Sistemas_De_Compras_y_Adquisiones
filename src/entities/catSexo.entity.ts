import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatSexo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
