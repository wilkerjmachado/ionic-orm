import { ColumnMetadata } from "../metadata/ColumnMetadata";
import { ForeignKeyMetadata } from "../metadata/ForeignKeyMetadata";
import { TableMetadata } from "../metadata/TableMetadata";
import { IndexMetadata } from "../metadata/IndexMetadata";
import { EntityMetadata } from "../metadata/EntityMetadata";
/**
 * Helps to create EntityMetadatas for junction tables.
 */
export class JunctionEntityMetadataBuilder {
    build(driver, lazyRelationsWrapper, args) {
        const column1 = args.joinTable.referencedColumn;
        const column2 = args.joinTable.inverseReferencedColumn;
        const tableMetadata = new TableMetadata({
            target: "",
            name: args.joinTable.name,
            type: "junction"
        });
        const junctionColumn1 = new ColumnMetadata({
            target: "__virtual__",
            propertyType: column1.type,
            propertyName: args.joinTable.joinColumnName,
            mode: "virtual",
            options: {
                length: column1.length,
                type: column1.type,
                name: args.joinTable.joinColumnName,
                nullable: false,
                primary: true
            }
        });
        const junctionColumn2 = new ColumnMetadata({
            target: "__virtual__",
            propertyType: column2.type,
            propertyName: args.joinTable.inverseJoinColumnName,
            mode: "virtual",
            options: {
                length: column2.length,
                type: column2.type,
                name: args.joinTable.inverseJoinColumnName,
                nullable: false,
                primary: true
            }
        });
        const entityMetadata = new EntityMetadata({
            target: "__virtual__",
            tablesPrefix: driver.options.tablesPrefix,
            namingStrategy: args.namingStrategy,
            tableMetadata: tableMetadata,
            columnMetadatas: [
                junctionColumn1,
                junctionColumn2
            ],
            foreignKeyMetadatas: [
                new ForeignKeyMetadata([junctionColumn1], args.firstTable, [column1]),
                new ForeignKeyMetadata([junctionColumn2], args.secondTable, [column2])
            ],
            indexMetadatas: [
                new IndexMetadata({ columns: [args.joinTable.joinColumnName], unique: false }),
                new IndexMetadata({ columns: [args.joinTable.inverseJoinColumnName], unique: false })
            ]
        }, lazyRelationsWrapper);
        entityMetadata.columns[0].entityMetadata = entityMetadata;
        entityMetadata.columns[1].entityMetadata = entityMetadata;
        return entityMetadata;
    }
}
//# sourceMappingURL=JunctionEntityMetadataBuilder.js.map