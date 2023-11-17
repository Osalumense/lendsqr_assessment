import { Knex } from "../config/config";
const KnexConfig = Knex.config;
import { Exclude, Transform } from 'class-transformer';


export interface UserInstance {
    id?: number;
    uuid: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;

    toJSON?: () => Omit<UserInstance, 'password'>;
}

const knexInstance = require('knex')(KnexConfig);

class User {
    private knex: any;

    constructor(knex: any) {
        this.knex = knex;
    }

    @Transform(({ value }) => value.toJSON(), { toClassOnly: true })
    public async getUserById(id: number, transform: boolean = true): Promise<UserInstance> {
        const user = await this.knex("users").where("id", id).first();

        if (transform) {
            return user;
        }

        return this.transformUser(user)
    }

    public async addUser(user: UserInstance):
    Promise<any> {
        return await this.knex("users").insert(user);
    }

    public async updateUser(id: number, user: UserInstance):
    Promise<any> {
        return await this.knex('users').where('id', id).update(user);
    }

    public async getUserByEmail(email: string):
    Promise<any> {
        return await this.knex('users').where("email", email).first();
    }

    private transformUser(user: UserInstance): UserInstance {
        return {
          ...user,
          toJSON: () => ({
            ...user,
            password: undefined,
          }),
        };
      }
}

let userQueries = new User(knexInstance)
export default userQueries;

