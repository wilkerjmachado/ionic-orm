import { EntityMetadata } from "../metadata/EntityMetadata";
import { ColumnMetadata } from "../metadata/ColumnMetadata";
import { ForeignKeyMetadata } from "../metadata/ForeignKeyMetadata";
import { TableMetadata } from "../metadata/TableMetadata";
import { ColumnTypes } from "../metadata/types/ColumnTypes";
/**
 * Helps to create EntityMetadatas for junction tables for closure tables.
 */
export class ClosureJunctionEntityMetadataBuilder {
    build(driver, lazyRelationsWrapper, args) {
        const columns = [
            new ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: args.primaryColumn.type,
                mode: "virtual",
                options: {
                    length: args.primaryColumn.length,
                    type: args.primaryColumn.type,
                    name: "ancestor"
                }
            }),
            new ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: args.primaryColumn.type,
                mode: "virtual",
                options: {
                    length: args.primaryColumn.length,
                    type: args.primaryColumn.type,
                    name: "descendant"
                }
            })
        ];
        if (args.hasTreeLevelColumn) {
            columns.push(new ColumnMetadata({
                target: "__virtual__",
                propertyName: "__virtual__",
                propertyType: ColumnTypes.INTEGER,
                mode: "virtual",
                options: {
                    type: ColumnTypes.INTEGER,
                    name: "level"
                }
            }));
        }
        const closureJunctionTableMetadata = new TableMetadata({
            target: "__virtual__",
            name: args.table.name,
            type: "closure-junction"
        });
        return new EntityMetadata({
            target: "__virtual__",
            tablesPrefix: driver.options.tablesPrefix,
            namingStrategy: args.namingStrategy,
            tableMetadata: closureJunctionTableMetadata,
            columnMetadatas: columns,
            foreignKeyMetadatas: [
                new ForeignKeyMetadata([columns[0]], args.table, [args.primaryColumn]),
                new ForeignKeyMetadata([columns[1]], args.table, [args.primaryColumn])
            ]
        }, lazyRelationsWrapper);
    }
}
//# sourceMappingURL=ClosureJunctionEntityMetadataBuilder.js.map