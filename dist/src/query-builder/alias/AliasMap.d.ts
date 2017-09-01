import { EntityMetadata } from "../../metadata/EntityMetadata";
import { Alias } from "./Alias";
import { EntityMetadataCollection } from "../../metadata-args/collection/EntityMetadataCollection";
/**
 */
export declare class AliasMap {
    private entityMetadatas;
    aliases: Alias[];
    constructor(entityMetadatas: EntityMetadataCollection);
    addMainAlias(alias: Alias): void;
    addAlias(alias: Alias): void;
    readonly hasMainAlias: boolean;
    readonly mainAlias: Alias;
    findAliasByName(name: string): Alias | undefined;
    findAliasByParent(parentAliasName: string, parentPropertyName: string): Alias | undefined;
    getEntityMetadataByAlias(alias: Alias): EntityMetadata | undefined;
}
