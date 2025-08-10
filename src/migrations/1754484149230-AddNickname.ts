import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNickname1754484149230 implements MigrationInterface {
    name = 'AddNickname1754484149230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "email" character varying NOT NULL,
                "age" integer,
                "role" character varying(50) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "nuevoCampo" character varying,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
