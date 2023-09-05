import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CatEntidadFederativa {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
