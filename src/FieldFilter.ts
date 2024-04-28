export const FilterOps = ["=", "!=", "<", ">", "<=", ">="];

export type FilterOpType = "=" | "!=" | "<" | ">" | "<=" | ">=";

export class FieldFilter {
    project: string;
    board: string;
    fieldName: string;
    fieldVal: string;
    compOp: FilterOpType;
}