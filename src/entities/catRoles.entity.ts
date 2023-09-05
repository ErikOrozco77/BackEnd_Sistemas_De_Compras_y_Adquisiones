import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "cat_roles" })
export class CatRoles {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    descripcion!: string;
}
