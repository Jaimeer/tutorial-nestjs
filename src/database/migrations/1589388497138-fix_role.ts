import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRole1589388497138 implements MigrationInterface {
    name = 'fixRole1589388497138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "decription" TO "description"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "description" TO "decription"`, undefined);
    }

}
