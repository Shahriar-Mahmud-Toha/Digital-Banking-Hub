import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { AuthenticationEntity } from "./auth.entity";
import { AccountEntity } from "./accountInfo.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity("registration")
export class UserRegistrationEntity {
    @PrimaryColumn({ type: "varchar" })
    userId: string;

    @Column({ name: 'FulName', type: 'varchar', length: 150 })
    name: string;

    @Column({ name: 'Gender', type: 'varchar', length: 6 })
    gender: string;

    @Column({ name: 'DOB', type: 'varchar' })
    dob: string;

    @Column({ name: 'NID', unique: true })
    NID: number;

    @Column({ name: 'Phone' })
    phone: number;

    @Column({ name: 'Address' })
    address: string;

    @Column({ name: 'FileName',nullable:true })
    filename: string;


    @BeforeInsert()
    generateId(): string {
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'U-' + randomNumber;
        return this.userId;
    }

    @OneToOne(() => AuthenticationEntity, Authentication => Authentication.userId, { cascade: true, onDelete: 'CASCADE' })
    Authentication: AuthenticationEntity;

    @OneToMany(() => AccountEntity, accounts => accounts.userId, { cascade: true, onDelete: 'CASCADE' })
    accounts: AccountEntity[];

    @OneToMany(() => TransactionEntity, transection => transection.userId, { cascade: true, onDelete: 'CASCADE' })
    transections: TransactionEntity[];
}
