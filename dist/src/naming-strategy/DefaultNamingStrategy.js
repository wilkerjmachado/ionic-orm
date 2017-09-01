import { sha1 } from '../util/sha1';
import _ from "lodash";
/**
 * Naming strategy that is used by default.
 */
export class DefaultNamingStrategy {
    tableName(className, customName) {
        return customName ? customName : _.snakeCase(className);
    }
    columnName(propertyName, customName) {
        return customName ? customName : propertyName;
    }
    embeddedColumnName(embeddedPropertyName, columnPropertyName, columnCustomName) {
        return _.camelCase(embeddedPropertyName + "_" + (columnCustomName ? columnCustomName : columnPropertyName));
    }
    relationName(propertyName) {
        return propertyName;
    }
    indexName(customName, tableName, columns) {
        if (customName)
            return customName;
        const key = "ind_" + tableName + "_" + columns.join("_");
        return "ind_" + sha1.hash(key);
    }
    joinColumnInverseSideName(joinColumnName, propertyName) {
        if (joinColumnName)
            return joinColumnName;
        return propertyName;
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName, firstColumnName, secondColumnName) {
        return _.snakeCase(firstTableName + "_" + firstPropertyName + "_" + secondTableName + "_" + secondColumnName);
    }
    joinTableColumnName(tableName, columnName, secondTableName, secondColumnName) {
        const column1 = _.camelCase(tableName + "_" + columnName);
        const column2 = _.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_1" : column1; // todo: do we still need _1 prefix?!
    }
    joinTableInverseColumnName(tableName, columnName, secondTableName, secondColumnName) {
        const column1 = _.camelCase(tableName + "_" + columnName);
        const column2 = _.camelCase(secondTableName + "_" + secondColumnName);
        return column1 === column2 ? column1 + "_2" : column1; // todo: do we still need _2 prefix?!
    }
    closureJunctionTableName(tableName) {
        return tableName + "_closure";
    }
    foreignKeyName(tableName, columnNames, referencedTableName, referencedColumnNames) {
        const key = `${tableName}_${columnNames.join("_")}_${referencedTableName}_${referencedColumnNames.join("_")}`;
        return "fk_" + sha1.hash((key).substr(0, 27)); // todo: use crypto instead?
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return _.camelCase(parentTableName + "_" + parentTableIdPropertyName);
    }
    /**
     * Adds prefix to the table.
     */
    prefixTableName(prefix, originalTableName) {
        return prefix + originalTableName;
    }
}
//# sourceMappingURL=DefaultNamingStrategy.js.map