import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CatRoles } from "./catRoles.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    names!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ default: false })
    isActive!: boolean;

    @Column()
    registrationDate!: Date;

    @Column({ nullable: true })
    confirmationToken!: string;

    @Column({ nullable: true })
    confirmationTokenExpiration!: Date;

    @ManyToOne(() => CatRoles, { eager: true })
    rol!: CatRoles;
}
