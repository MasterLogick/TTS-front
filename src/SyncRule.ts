import {FieldFilter} from "./FieldFilter";

export type SyncDirection = "std" | "dts" | "cmp";

export class SyncRule {
    source: FieldFilter;
    destination: FieldFilter;
    direction: SyncDirection;
}