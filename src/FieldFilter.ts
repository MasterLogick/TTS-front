export const FilterOps = ["=", "!=", "<", ">", "<=", ">="];

export type FilterOpType = "=" | "!=" | "<" | ">" | "<=" | ">=";

export class FieldFilter {
    tracker: string;
    board: string;
    fieldName: string;
    fieldVal: string;
    compOp: FilterOpType;
    static DefaultFilter: FieldFilter = {tracker: "", board: "", fieldName: "", fieldVal: "", compOp: "="};
}