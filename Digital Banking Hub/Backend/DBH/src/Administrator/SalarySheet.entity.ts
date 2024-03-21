import { Authentication } from 'src/Authentication/Authentication.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, PrimaryColumn, Generated, OneToMany, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity("SalarySheet")
export class SalarySheet {
    @PrimaryColumn()
    Year: Number;
    @Column({name:"Email"})
    Email: String;
    @Column()
    Jan: Number;
    @Column()
    Feb: Number;
    @Column()
    Mar: Number;
    @Column()
    Apr: Number;
    @Column()
    May: Number;
    @Column()
    Jun: Number;
    @Column()
    Jul: Number;
    @Column()
    Aug: Number;
    @Column()
    Sep: Number;
    @Column()
    Oct: Number;
    @Column()
    Nov: Number;
    @Column()
    Dec: Number;

    @ManyToOne(() => Authentication, Authentication => Authentication.SalarySheet, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name:"Email"})
    Authentication: Authentication;
}
