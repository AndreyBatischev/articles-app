import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ArticlesSchema1723296658737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'articles',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'autor',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'publicatedDate',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isNullable: true,
                },
            ],
        }), true);

        await queryRunner.createForeignKey('articles', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('articles');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        await queryRunner.dropForeignKey('articles', foreignKey);
        await queryRunner.dropTable('articles');
    }
}
