import { MigrationInterface, QueryRunner } from "typeorm";

export class Agendas1754857400405 implements MigrationInterface {
    name = 'Agendas1754857400405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "prestador" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(120) NOT NULL,
                "zonaHoraria" character varying NOT NULL,
                "duracionBloqueMin" integer NOT NULL DEFAULT '30',
                CONSTRAINT "PK_0e2540f665eb454fcdd9df55f93" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "horario_especial" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "prestador_id" character varying NOT NULL,
                "fecha" date NOT NULL,
                "cerrado" boolean NOT NULL DEFAULT true,
                "inicio_especial" TIME,
                "fin_especial" TIME,
                CONSTRAINT "PK_3df4e87c188fb1b29f9b71de86e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e58f275383b250db2e3ce007aa" ON "horario_especial" ("prestador_id", "fecha")
        `);
        await queryRunner.query(`
            CREATE TABLE "cita" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "prestador_id" character varying NOT NULL,
                "inicio_utc" TIMESTAMP WITH TIME ZONE NOT NULL,
                "fin_utc" TIMESTAMP WITH TIME ZONE NOT NULL,
                "nombre_cliente" character varying(160) NOT NULL,
                "email_cliente" character varying(160),
                "telefono_cliente" character varying(32),
                "estado" character varying NOT NULL DEFAULT 'RESERVADA',
                "creada_en" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_57e1373661f0c185987b03dc6c8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_3cfac1cb0d1b6629ceb2ab2afc" ON "cita" ("prestador_id", "inicio_utc")
        `);
        await queryRunner.query(`
            CREATE TABLE "horario_semana" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "prestador_id" character varying NOT NULL,
                "dia_semana" integer NOT NULL,
                "hora_inicio" TIME NOT NULL,
                "hora_fin" TIME NOT NULL,
                CONSTRAINT "PK_dc88b7ccd5625b0bead45c710a7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8e759fee699ea284f49f559b39" ON "horario_semana" ("prestador_id", "dia_semana")
        `);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DROP INDEX "public"."IDX_8e759fee699ea284f49f559b39"
        `);
        await queryRunner.query(`
            DROP TABLE "horario_semana"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_3cfac1cb0d1b6629ceb2ab2afc"
        `);
        await queryRunner.query(`
            DROP TABLE "cita"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e58f275383b250db2e3ce007aa"
        `);
        await queryRunner.query(`
            DROP TABLE "horario_especial"
        `);
        await queryRunner.query(`
            DROP TABLE "prestador"
        `);
    }

}
