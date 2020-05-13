import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1589386904783 implements MigrationInterface {
    name = 'fixUserDetails1589386904783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "lastname"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "lastname" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "created_at" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "updated_at" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "updated_at" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "created_at" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "lastname"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "lastname" character varying(50) NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`, undefined);
    }

}
