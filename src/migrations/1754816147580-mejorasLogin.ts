import { MigrationInterface, QueryRunner } from "typeorm";

export class MejorasLogin1754816147580 implements MigrationInterface {
    name = 'MejorasLogin1754816147580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "age"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "create_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "update_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documenTypeId"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documenNumber"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birth_date" date
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documentTypeId" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documentNumber" character varying(32) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "passwordHash" character varying(72) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "cellphone"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "cellphone" character varying(32) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" character varying(160) NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "CHK_cce0243fe7fc57c95cba43149f" CHECK (
                    "birth_date" IS NULL
                    OR "birth_date" <= CURRENT_DATE
                )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "CHK_cce0243fe7fc57c95cba43149f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" character varying(100)
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "cellphone"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "cellphone" character varying(14)
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" character varying(50) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "passwordHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documentNumber"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documentTypeId"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birth_date"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documenNumber" character varying(20)
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documenTypeId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "update_at" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "create_at" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "age" integer
        `);
    }

}
