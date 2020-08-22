import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class removePasswordFromUsers1598058528013
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'password');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const password = new TableColumn({ type: 'varchar', name: 'password' });

    await queryRunner.addColumn('users', password);
  }
}
