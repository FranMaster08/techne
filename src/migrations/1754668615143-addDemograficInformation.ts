import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDemograficInformation1754668615143 implements MigrationInterface {
    name = 'AddDemograficInformation1754668615143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documenTypeId" integer  NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documenNumber" character varying(20)  NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "cellphone" character varying(14)  NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" character varying(100)  NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "cellphone"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documenNumber"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documenTypeId"
        `);
    }

}
