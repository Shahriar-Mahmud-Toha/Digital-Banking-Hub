import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserRegistrationEntity } from "./user.entity";


@Entity("Authentication")
export class AuthenticationEntity{
 
    @PrimaryColumn({name:'Email', type: 'varchar', length: 100})
    email: string;
    @Column({ type: 'varchar' })
    password: string;
    @Column({name:'Role', type: 'varchar', length: 20 })
    role: string;
    @Column({name:'Active',default:false})
    isActive: boolean;

    @OneToOne(() => UserRegistrationEntity, Users => Users.Authentication)
    @JoinColumn({name:'User_ID'})
    userId: UserRegistrationEntity;
   
}