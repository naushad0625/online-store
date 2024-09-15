import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAc {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ nullable: false })
  private name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  private email: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  private password: string;

  @Column({
    enum: ['Admin', 'User', 'Visitor'],
    nullable: true,
    default: 'User',
  })
  private role: string;

  @Column({ nullable: true, default: 0 })
  private balance: number;

  getId(): number {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(pass: string) {
    this.password = pass;
  }

  getRole(): string {
    return this.role;
  }

  setRole(role: string) {
    this.role = role;
  }
}
