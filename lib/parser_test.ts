import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { parseRPSL, getAsSetMembers } from "./parser.ts";
import { RPSL } from "../types/RPSL.ts";

const RPSL = `as-set:          AS-TEST1
members:         AS-TEST2
members:         AS-TEST3
members:         AS1299
org:             ORG-TEST1-TEST
tech-c:          TEST1-TEST
admin-c:         TEST1-TEST
mnt-by:          MNT-TEST
source:          TEST`;

const PARSED_RPSL: RPSL = [
    ["as-set:", "AS-TEST1"],
    ["members:", "AS-TEST2"],
    ["members:", "AS-TEST3"],
    ["members:", "AS1299"],
    ["org:", "ORG-TEST1-TEST"],
    ["tech-c:", "TEST1-TEST"],
    ["admin-c:", "TEST1-TEST"],
    ["mnt-by:", "MNT-TEST"],
    ["source:", "TEST"]
];

const MEMBERS = [
    "AS-TEST2",
    "AS-TEST3",
    "AS1299"
];

Deno.test('parser', async (t) => {
    await t.step('test parsing', () => {
        const rpsl = parseRPSL(RPSL);

        assertEquals(rpsl, PARSED_RPSL);
    });

    await t.step('test getting members', () => {
        const members = getAsSetMembers(PARSED_RPSL);

        assertEquals(members, MEMBERS);
    });
});