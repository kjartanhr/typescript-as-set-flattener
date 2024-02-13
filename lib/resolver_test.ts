import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { flatten } from "./resolver.ts";
import { asnSorter } from "./helpers.ts";

const MEMBERS = [
    "as1",
    "as2",
    "as3"
];

Deno.test('resolver', async (t) => {
    await t.step('test resolving', async () => {
        const flattened = await flatten('AS-TEST1', '127.0.0.1', true);
        const sorted = flattened.sort(asnSorter);

        assertEquals(sorted, MEMBERS);
    });
});