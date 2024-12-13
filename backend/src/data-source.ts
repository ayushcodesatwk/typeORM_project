import { DataSource } from "typeorm"
// import { Users } from "./entities/user"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "orm_project",
    synchronize: true,
    logging: true,
    entities: ["./src/entities/*.ts"],
    subscribers: [],
    migrations: ["src/migration/*.ts", "src/migration/*.js"],
})