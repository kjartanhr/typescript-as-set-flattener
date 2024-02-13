import { assertEquals } from "https://deno.land/std@0.215.0/assert/mod.ts";
import { whois } from "./whois.ts";

Deno.test('whois server', async () => {
    const query = await whois('AS-TEST1', {server: '127.0.0.1', port: 43});

    assertEquals(query.status.success, true);
});