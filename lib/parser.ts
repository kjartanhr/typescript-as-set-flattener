import { RPSL } from "../types/RPSL.ts";

export function parseRPSL(
    rpsl: string
): RPSL {
    const CHAR_NEWLINE = '\n';
    const CHAR_SPACE = ' ';
    const CHAR_EMPTY = '';
    const IGNORED_ATTRIBUTES = [
        "remarks:",
        "descr:"
    ]

    return rpsl.split(CHAR_NEWLINE)
        .map((line) => (
            line.split(CHAR_SPACE)
                .filter(segment => segment !== CHAR_EMPTY)
        ))
        .filter(line => (
            !IGNORED_ATTRIBUTES.includes(line[0])
        )) as unknown as RPSL;
}

export function getAsSetMembers(
    rpsl: RPSL
) {
    const members = [];

    for (const line of rpsl) {
        if (line[0] === "members:") {
            members.push(line[1]);
        }
    }

    return members;
}