import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteFieldNuevoCampo1754488280310 implements MigrationInterface {
    name = 'DeleteFieldNuevoCampo1754488280310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "nuevoCampo"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "nuevoCampo" character varying
        `);
    }

}
