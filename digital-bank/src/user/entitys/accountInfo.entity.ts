import { UserRegistrationEntity } from "./user.entity";
import { ServiceEntity } from "./services.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Optional } from "@nestjs/common";

@Entity("AccountInfo")
export class AccountEntity {
    @PrimaryColumn({ name: 'accountNumber' ,type:'varchar'})
    accountNumber: string;

    @Column({ name: 'nomineeName', type: 'varchar', length: 150 })
    name: string;

    @Column({ name: 'Gender', type: 'varchar', length: 6 })
    gender: string;

    @Column({ name: 'DOB', type: 'varchar' })
    dob: string;

    @Column({ name: 'NID', unique: true })
    nid: number;

    @Column({ name: 'Phone',type:'varchar' })
    phone: string;

    @Column({ name: 'Address' })
    address: string;

    @Column({ name: 'nomineePicture',nullable:true })
    filename: string;

    @Column({ name: 'accountType' })
    accountType: string;

    @Column({ name: 'balance',default:0 })
    balance: number;

    @BeforeInsert()
    generateAccountNumber(): string {
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
        this.accountNumber = randomNumber;
        return this.accountNumber
    }

   
    @ManyToOne(() => UserRegistrationEntity, user => user.accounts)
    @JoinColumn({ name: 'User_ID' })
    userId: UserRegistrationEntity;


    @OneToMany(() => ServiceEntity, service => service.account)
    services: ServiceEntity[];
}
