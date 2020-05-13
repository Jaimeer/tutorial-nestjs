import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1589386844034 implements MigrationInterface {
    name = 'fixUserDetails1589386844034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "lastname"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "lastname" character varying(50) NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "lastname"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "lastname" character varying NOT NULL`, undefined);
    }

}
