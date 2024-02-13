import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { formatAsSet } from "./formatter.ts";

const EXPECTED = `as-set:          AS-TEST1
members:         AS-TEST2
members:         AS-TEST3
members:         AS1299
org:             ORG-TEST1-TEST
tech-c:          TEST1-TEST
admin-c:         TEST1-TEST
mnt-by:          MNT-TEST
source:          TEST
`;

Deno.test('formatter', async (t) => {
    await t.step('test formatting as set', () => {
        const formatted = formatAsSet({
            "as-set": "AS-TEST1",
            "members": [
                "AS-TEST2",
                "AS-TEST3",
                "AS1299"
            ],
            "admin-c": "TEST1-TEST",
            "tech-c": "TEST1-TEST",
            "org": "ORG-TEST1-TEST",
            "mnt-by": "MNT-TEST",
            "source": "TEST"
        });

        assertEquals(formatted, EXPECTED);
    });
});