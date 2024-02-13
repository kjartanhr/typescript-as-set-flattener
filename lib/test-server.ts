import { RPSLObject } from "../types/RPSL.ts";
import { formatAsSet } from "./formatter.ts";

const data: Array<RPSLObject> = [
    {
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
    },
    {
        "as-set": "AS-TEST2",
        "members": [
            "AS-TEST3",
            "AS1",
            "AS2"
        ],
        "admin-c": "TEST2-TEST",
        "tech-c": "TEST2-TEST",
        "org": "ORG-TEST2-TEST",
        "mnt-by": "MNT-TEST",
        "source": "TEST"
    },
    {
        "as-set": "AS-TEST3",
        "members": [
            "AS1",
            "AS1",
            "AS2",
            "AS3",
            "AS174",
            "AS-TEST2"
        ],
        "admin-c": "TEST3-TEST",
        "tech-c": "TEST3-TEST",
        "org": "ORG-TEST3-TEST",
        "mnt-by": "MNT-TEST",
        "source": "TEST"
    },
];

// For some reason unknown to my fairly unexperienced self Deno's socket reader
// seems to always return a Uint8Array of length 2^16 even if the read string
// is only of say length 8. Therefore, to compare the strings we have in our
// sample data we must strip the thousands of zeroes from the Uint8Array
// returned by the socket reader. This hacky function does that, but with no
// regard for whether those zeroes are part of the data or not. That should be
// fine though; we are not expecting any ASCII NULLs or UTF8 control chars. 
function uint8arrstrip(
    arr: Uint8Array
) {
    const rarr = [];

    for (let i = 0; i < arr.length; i++) {
        const cur = arr[(arr.length - 1) - i];

        if (cur !== 0) rarr.push(cur); 
    }

    return Uint8Array.from(rarr.reverse());
}

function template(
    str: string
) {
    return `% This is the TEST WHOIS server.
% Queries are NOT rate-limited.
% Data is NOT subject to copyright.

${str.replace(/\n$/gm, '')}

% Query served ${new Date().toLocaleString()}.
`;
}

const listener = Deno.listen({
    port: 43
});

console.log('WHOIS test server listening on 0.0.0.0:43');

for await (const conn of listener){
    const reader = conn.readable.getReader();
    const writer = conn.writable.getWriter();
    const enc = (str: string | undefined) => new TextEncoder().encode(str);
    const dec = (bytes: BufferSource | undefined) => new TextDecoder().decode(bytes);
    const bytes = await reader.read();
    const str = dec(bytes.value?.buffer);
    const strClean = str.replace(/ /g, '').replace(/\n/g, '');
    const strStrip = dec(uint8arrstrip(enc(strClean)));

    const result = data.find(entry => entry["as-set"] === strStrip);

    if (result) {
        writer.write(enc(template(formatAsSet(result))));
    } else {
        writer.write(enc(template("% Could not find specified record.")));
    }

    conn.close();
}