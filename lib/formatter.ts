import { RPSLObject } from "../types/RPSL.ts";

function pad(
    key: string, 
    value: string
) {
    return `${key.padEnd(17, " ")}${value}\n`;
}

function format(
    key: string,
    value: Array<string> | string | undefined
) {
    let str = "";

    if (!value) {
        return "";
    }

    if (Array.isArray(value)) {
        for (const entry of value) {
            str += pad(`${key}:`, entry);
        }
    } else {
        str += pad(`${key}:`, value);
    }

    return str;
}

// This ensures objects are formatted in template order
// (https://apps.db.ripe.net/db-web-ui/query?searchtext=-t%20as-set).
// If this isn't done the key ("as-set") could appear elsewhere than the top,
// which IRR databases will not accept.
const ORDER = [
    "as-set",
    "descr",
    "members",
    "mbrs-by-ref",
    "remarks",
    "org",
    "tech-c",
    "admin-c",
    "notify",
    "mnt-by",
    "mnt-lower",
    "created",
    "last-modified",
    "source"
];

export function formatAsSet(
    data: RPSLObject
) {
    let str = "";

    for (const key of ORDER) {
        // @ts-ignore: We handle data[key] not being defined elsewhere.
        const formatted = format(key, data[key]);

        if (formatted) str += formatted;
    }

    return str;
}