import { RPSLObject } from "./types/RPSL.ts";

interface Configuration {
    flattenerOptions: {
        maxDepth: number,
        whoisServer: string,
        asSet: string
    },
    resultOptions: Omit<RPSLObject, 'members'>,
    omit?: {
        carriers?: Array<string>,
        blocked?: Array<string>
    }
}

export const config: Configuration = {
    // Options for the flattener to work from.
    flattenerOptions: {
        maxDepth: 10,                   // maximum recursion depth
        whoisServer: 'whois.radb.net',  // whois server to query
        asSet: 'AS51019:AS-CONE'        // as set to flatten from
    },
    // RPSL attributes for the resulting AS set. Definitions from
    // https://apps.db.ripe.net/db-web-ui/query?searchtext=-t%20as-set.
    // Attributes allowing multiple entries represented string arrays.
    resultOptions: {
        "as-set": "AS51019:AS-CLEAN",
        "descr": "Flattened (cleaned) AS set for AS51019.",
        "org": "ORG-KHR1-RIPE",
        "tech-c": "KA7557-RIPE",
        "admin-c": "KA7557-RIPE",
        "mnt-by": "is-kjartann-1-mnt",
        "source": "RIPE"
    },
    // ASNs to be omitted.
    omit: {
        // List of known carriers to be omitted.
        carriers: [
            "AS6939",                   // hurricane
            "AS-HURRICANE",             // hurricane
            "AS-HURRICANEV6",           // hurricane
            "AS174",                    // cogent
            "AS701",                    // verizon
            "AS1299",                   // arelion
            "AS1299:AS-TWELVE99",       // arelion
            "AS1299:AS-TWELVE99-V4",    // arelion
            "AS1299:AS-TWELVE99-V6",    // arelion
            "AS2914",                   // ntt
            "AS2914:AS-GLOBAL",         // ntt
            "AS3257",                   // gtt
            "AS-GTT",                   // gtt
            "AS3320",                   // dtag
            "AS3320:AS-DTAG",           // dtag
            "AS3356",                   // lumen
            "AS3491",                   // pccw
            "AS-CAIS",                  // pccw
            "AS4134",                   // china telecom
            "AS-CN",                    // china telecom
            "AS5511",                   // orange
            "AS-OPENTRANSIT",           // orange
            "AS6453",                   // tata
            "AS-GLOBEINTERNET",         // tata
            "AS-GLOBEINTERNET-CLIENTS", // tata
            "AS6461",                   // zayo
            "AS-MFNX",                  // zayo
            "AS6762",                   // seabone
            "AS-SEABONE",               // seabone
            "AS-SEABONECUSTEU",         // seabone
            "AS-SEABONECUSTLA",         // seabone
            "AS-SEABONECUSTNA",         // seabone
            "AS-SEABONECUSTMEAF",       // seabone
            "AS-SEABONECUSTAS",         // seabone
            "AS6830",                   // lgi
            "AS6830:AS-AORTA",          // lgi
            "AS7018",                   // at&t
            "AS577",                    // bell
            "AS577:AS-CUSTOMERS",       // bell
        ],
        // Works the same as the above, language is just different so no one gets mad
        // over Cloudflare, or similar, getting classified as a carrier.
        //
        // Intended section for blocking networks you don't like or know shouldn't
        // be in your AS set.
        blocked: [
            "AS6540",               // path
            "AS396998",             // path
            "AS-PATH",              // path
            "AS13335",              // cloudflare
            "AS13335:AS-CLOUDFLARE" // cloudflare
        ]
    }
};