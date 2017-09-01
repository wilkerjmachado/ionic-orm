import { TargetMetadataArgsCollection } from "./collection/TargetMetadataArgsCollection";
import { PropertyMetadataArgsCollection } from "./collection/PropertyMetadataArgsCollection";
import { RelationMetadataArgs } from "./RelationMetadataArgs";
import { ColumnMetadataArgs } from "./ColumnMetadataArgs";
import { RelationCountMetadataArgs } from "./RelationCountMetadataArgs";
import { IndexMetadataArgs } from "./IndexMetadataArgs";
import { EntityListenerMetadataArgs } from "./EntityListenerMetadataArgs";
import { TableMetadataArgs } from "./TableMetadataArgs";
import { NamingStrategyMetadataArgs } from "./NamingStrategyMetadataArgs";
import { JoinTableMetadataArgs } from "./JoinTableMetadataArgs";
import { JoinColumnMetadataArgs } from "./JoinColumnMetadataArgs";
import { EmbeddedMetadataArgs } from "./EmbeddedMetadataArgs";
import { EntitySubscriberMetadataArgs } from "./EntitySubscriberMetadataArgs";
import { RelationIdMetadataArgs } from "./RelationIdMetadataArgs";
import { InheritanceMetadataArgs } from "./InheritanceMetadataArgs";
import { DiscriminatorValueMetadataArgs } from "./DiscriminatorValueMetadataArgs";
/**
 * Storage all metadatas of all available types: tables, fields, subscribers, relations, etc.
 * Each metadata represents some specifications of what it represents.
 */
export declare class MetadataArgsStorage {
    readonly tables: TargetMetadataArgsCollection<TableMetadataArgs>;
    readonly namingStrategies: TargetMetadataArgsCollection<NamingStrategyMetadataArgs>;
    readonly entitySubscribers: TargetMetadataArgsCollection<EntitySubscriberMetadataArgs>;
    readonly indices: TargetMetadataArgsCollection<IndexMetadataArgs>;
    readonly columns: PropertyMetadataArgsCollection<ColumnMetadataArgs>;
    readonly relations: PropertyMetadataArgsCollection<RelationMetadataArgs>;
    readonly joinColumns: PropertyMetadataArgsCollection<JoinColumnMetadataArgs>;
    readonly joinTables: PropertyMetadataArgsCollection<JoinTableMetadataArgs>;
    readonly entityListeners: PropertyMetadataArgsCollection<EntityListenerMetadataArgs>;
    readonly relationCounts: PropertyMetadataArgsCollection<RelationCountMetadataArgs>;
    readonly relationIds: PropertyMetadataArgsCollection<RelationIdMetadataArgs>;
    readonly embeddeds: PropertyMetadataArgsCollection<EmbeddedMetadataArgs>;
    readonly inheritances: TargetMetadataArgsCollection<InheritanceMetadataArgs>;
    readonly discriminatorValues: TargetMetadataArgsCollection<DiscriminatorValueMetadataArgs>;
    /**
     * Gets merged (with all abstract classes) table metadatas for the given classes.
     */
    getMergedTableMetadatas(classes?: Function[]): {
        table: TableMetadataArgs;
        parent: undefined;
        inheritance: InheritanceMetadataArgs | undefined;
        children: TableMetadataArgs[];
        indices: TargetMetadataArgsCollection<IndexMetadataArgs>;
        columns: PropertyMetadataArgsCollection<ColumnMetadataArgs>;
        relations: PropertyMetadataArgsCollection<RelationMetadataArgs>;
        joinColumns: PropertyMetadataArgsCollection<JoinColumnMetadataArgs>;
        joinTables: PropertyMetadataArgsCollection<JoinTableMetadataArgs>;
        entityListeners: PropertyMetadataArgsCollection<EntityListenerMetadataArgs>;
        relationCounts: PropertyMetadataArgsCollection<RelationCountMetadataArgs>;
        relationIds: PropertyMetadataArgsCollection<RelationIdMetadataArgs>;
        embeddeds: PropertyMetadataArgsCollection<EmbeddedMetadataArgs>;
        discriminatorValues: DiscriminatorValueMetadataArgs[];
    }[];
    /**
     * Gets merged (with all abstract classes) embeddable table metadatas for the given classes.
     */
    getMergedEmbeddableTableMetadatas(classes?: Function[]): {
        table: TableMetadataArgs;
        columns: PropertyMetadataArgsCollection<ColumnMetadataArgs>;
    }[];
    /**
     */
    private mergeWithAbstract(allTableMetadatas, table);
    /**
     */
    private mergeWithEmbeddable(allTableMetadatas, tableMetadata);
    /**
     * Checks if this table is inherited from another table.
     */
    private isInherited(target1, target2);
}
