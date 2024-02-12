export type RPSLKeys = "as-set" 
    | "descr" 
    | "members"
    | "mbrs-by-ref"
    | "remarks"
    | "org"
    | "tech-c"
    | "admin-c"
    | "notify"
    | "mnt-by"
    | "mnt-lower"
    | "created"
    | "last-modified"
    | "source";

export type RPSLKey = `${RPSLKeys}:`;

export type RPSL = Array<[RPSLKey, string]>;

export interface RPSLObject {
    "as-set": string,
    descr?: Array<string> | string,
    members: Array<string> | string,
    "mbrs-by-ref"?: Array<string> | string,
    remarks?: Array<string> | string,
    org: Array<string> | string,
    "tech-c": Array<string> | string,
    "admin-c": Array<string> | string,
    notify?: Array<string> | string;
    "mnt-by": Array<string> | string,
    "mnt-lower"?: Array<string> | string,
    source: string
}