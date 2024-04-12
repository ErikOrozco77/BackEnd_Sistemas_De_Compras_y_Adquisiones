import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { Proveedor } from "./proveedor.entity";
import { CatProveedoresConcursantes } from "./catProveedoresConcursantes.entity";


@Entity()
export class Concurso {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => CatProveedoresConcursantes, (pc) => pc.concurso)
    catProveedoresConcursantes!: CatProveedoresConcursantes[];

    @ManyToOne(() => Proveedor, { eager: true, cascade: true }) // Agregamos 'cascade' si es necesario
    @JoinColumn({ name: "ganador_id" })
    proveedorGanador!: Proveedor;
    
    @Column()
    id_concurso!: string;

    @Column()
    nombreDeConcurso!: string;

    @Column({ type: 'date' }) 
    fechaEntregadeDocumentos!: Date;

    @Column({ type: 'date' })  
    fechaExpedicion!: Date;

    @Column({ default: false })
    isActive!: boolean;


}

