export type RPSLKeys = "as-set" | 
    "descr" | 
    "members" | 
    "mbrs-by-ref" | 
    "remarks" | 
    "org" | 
    "tech-c" | 
    "admin-c" | 
    "notify" | 
    "mnt-by" | 
    "mnt-lower" | 
    "created" | 
    "last-modified" | 
    "source";

export type RPSLKey = `${RPSLKeys}:`;

export type RPSL = Array<[RPSLKey, string]>;