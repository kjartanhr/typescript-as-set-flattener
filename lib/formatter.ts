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
        return;
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

export function formatAsSet(
    data: {
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
) {
    let str = "";
    for (const [key, value] of Object.entries(data)) {
        const formatted = format(key, value);

        if (formatted) str += formatted;
    }

    return str;
}