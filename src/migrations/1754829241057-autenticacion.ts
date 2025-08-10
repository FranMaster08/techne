import { MigrationInterface, QueryRunner } from "typeorm";

export class Autenticacion1754829241057 implements MigrationInterface {
    name = 'Autenticacion1754829241057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "lastName" character varying(100) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "lastName"
        `);
    }

}
