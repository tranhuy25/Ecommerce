// src/auth/model/user.model.ts

import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;
}
