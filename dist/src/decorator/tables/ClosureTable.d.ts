import { TableOptions } from "../options/TableOptions";
/**
 * Used on a tables that stores its children in a tree using closure deisgn pattern.
 */
export declare function ClosureTable(name?: string, options?: TableOptions): (target: Function) => void;
