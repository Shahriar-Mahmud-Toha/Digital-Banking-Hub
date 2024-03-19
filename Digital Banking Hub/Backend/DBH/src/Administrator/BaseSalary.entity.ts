import { randomBytes } from 'crypto';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, PrimaryColumn, Generated, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './Role.entity';

@Entity("BaseSalary")
export class BaseSalary {
    @PrimaryGeneratedColumn()
    Id: Number;
    @Column({name:"RoleId"})
    RoleId: Number;
    @Column()
    Salary: Number;
    @OneToOne(() => Role, Role => Role.BaseSalary)
    @JoinColumn({name:"RoleId"})
    Role: Role;
}
