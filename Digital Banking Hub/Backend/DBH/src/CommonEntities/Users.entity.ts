import { randomBytes } from 'crypto';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, PrimaryColumn, Generated, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity("Users")
export class Users {
    @PrimaryColumn()
    userId: String;
    @Column()
    FullName: string;
    @Column({name:"Email"})
    Email: string;
    @Column()
    Gender: string;
    @Column({type: 'date'})
    DOB: Date;
    @Column()
    NID:String
    @Column()
    Phone:String
    @Column()
    Address:String
    @Column()
    FileName:String //PictureName

    @OneToOne(() => Authentication, Authentication => Authentication.User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name:"Email"})
    Authentication: Authentication;
    @BeforeInsert()
    generateID() {
        const randomBytesBuffer = randomBytes(4);
        this.userId = "U-" + parseInt(randomBytesBuffer.toString('hex'), 16) % 1000000; //6 digit -> 10e6
    }
}
