module.exports = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: false,
    migrationsRun: true,
    entities: [`${__dirname}/**/*.entity.js`],
    migrationsTableName: 'migrations_typeorm',
    migrations: [`${__dirname}/*/migration/*.js`],
    cli: {
        migrationsDir: 'src/migration'
    }
}
