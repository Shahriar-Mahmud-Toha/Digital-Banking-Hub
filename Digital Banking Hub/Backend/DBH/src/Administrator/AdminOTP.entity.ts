import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, PrimaryColumn, Generated, OneToMany, OneToOne, IsNull, JoinColumn } from 'typeorm';

@Entity("AdminOTP")
export class AdminOTP {
    @PrimaryGeneratedColumn()
    Id: Number;
    
    @Column({name:"Email"})
    Email: string;
    
    @Column({ default: null })
    Otp: string;

    @Column({default:false})
    Verified: boolean;
}
