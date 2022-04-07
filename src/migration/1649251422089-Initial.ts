import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1649251422089 implements MigrationInterface {
    name = 'Initial1649251422089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`todo_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(512) NOT NULL, \`created_at\` double NOT NULL, \`updated_at\` double NULL, \`favourite\` tinyint NOT NULL DEFAULT 0, \`scheduled\` double NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstname\` varchar(64) NOT NULL, \`lastname\` varchar(64) NOT NULL, \`email\` varchar(128) NOT NULL, \`password\` text NOT NULL, \`refresh_hash\` text NULL, \`created_at\` double NOT NULL, UNIQUE INDEX \`IDX_415c35b9b3b6fe45a3b065030f\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`todo_entity\` ADD CONSTRAINT \`FK_f3037daa47e75647225318cc58e\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo_entity\` DROP FOREIGN KEY \`FK_f3037daa47e75647225318cc58e\``);
        await queryRunner.query(`DROP INDEX \`IDX_415c35b9b3b6fe45a3b065030f\` ON \`user_entity\``);
        await queryRunner.query(`DROP TABLE \`user_entity\``);
        await queryRunner.query(`DROP TABLE \`todo_entity\``);
    }

}
