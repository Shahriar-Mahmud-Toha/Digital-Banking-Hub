import { AccountEntity } from "./Account.entity";
import { TransactionEntity } from "./transaction.entity";
import { AuthenticationEntity } from "../auth/auth.entity";
import {  BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity("Users")
export class EmployeeEntity{

    @PrimaryColumn({type: "varchar"})
    userId: string;
    @Column({name:'FulName', type: 'varchar', length: 150 })
    name: string;
    @Column({name:'Gender', type: 'varchar', length: 6 })
    gender: string;
    @Column({name:'DOB', type: Date })
    dob: Date ;
    @Column({name:'NID',unique: true})
    nid: number;
    @Column({name:'Phone',type: 'varchar'})
    phone: string;
    @Column({name:'Address'})
    address: string;
    @Column({name:'FileName'})
    filename: string;
   
    
    @BeforeInsert()
    generateId():string {
    // Custom logic to generate a 6-digit number
       const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
       this.userId = 'E-' + randomNumber;
       return this.userId;
    }
    @OneToOne(() => AuthenticationEntity, Authentication => Authentication.userId, { cascade: true , onDelete: 'CASCADE' })
    Authentication: AuthenticationEntity;
    @OneToMany(() => AccountEntity, Accounts => Accounts.userId, { cascade: true , onDelete: 'CASCADE' })
    Accounts: AccountEntity[];
    @OneToMany(() => TransactionEntity, Transactions => Transactions.userId)
    Transactions: TransactionEntity[];
    
}

