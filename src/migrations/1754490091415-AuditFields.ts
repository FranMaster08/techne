import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditFields1754490091415 implements MigrationInterface {
    name = 'AuditFields1754490091415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "create_at" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "update_at" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "update_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "create_at"
        `);
    }

}
