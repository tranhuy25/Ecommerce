import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1737295892903 implements MigrationInterface {
    name = 'Generated1737295892903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_log_payment_status_enum" AS ENUM('PENDING', 'COMPLETED_SUCCESSFULLY', 'FAILED', 'FAILED_REFUND', 'REFUNDED')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_log_payment_type_enum" AS ENUM('CARD', 'VOUCHER')`);
        await queryRunner.query(`CREATE TABLE "payment_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkout_id" uuid NOT NULL, "payment_request" jsonb NOT NULL, "payment_response" jsonb, "refund_response" jsonb, "payment_status" "public"."payment_log_payment_status_enum" NOT NULL, "payment_type" "public"."payment_log_payment_type_enum" NOT NULL, "payment_end_dtm" TIMESTAMP WITH TIME ZONE, "create_dtm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modify_dtm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" bigint DEFAULT '0', CONSTRAINT "PK_1b679dd9b2a5aec836097f7e6d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."checkout_payment_status_enum" AS ENUM('INITIALIZED', 'COMPLETED', 'FAILED_PAYMENT', 'FAILED_CHECKOUT', 'REFUNDED', 'FAILED_REFUND')`);
        await queryRunner.query(`CREATE TABLE "checkout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying(60), "currency" character varying(12) NOT NULL, "amount" bigint DEFAULT '0', "payment_status" "public"."checkout_payment_status_enum" NOT NULL, "payment_request" jsonb, "create_dtm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modify_dtm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c3c52ebf395ba358759b1111ac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_log" ADD CONSTRAINT "FK_5280a7a0bd49d2426102bfd84a3" FOREIGN KEY ("checkout_id") REFERENCES "checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_log" DROP CONSTRAINT "FK_5280a7a0bd49d2426102bfd84a3"`);
        await queryRunner.query(`DROP TABLE "checkout"`);
        await queryRunner.query(`DROP TYPE "public"."checkout_payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment_log"`);
        await queryRunner.query(`DROP TYPE "public"."payment_log_payment_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_log_payment_status_enum"`);
    }

}
