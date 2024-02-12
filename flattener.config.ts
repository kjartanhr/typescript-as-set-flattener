import { RPSLObject } from "./types/RPSL.ts";

interface Configuration {
    flattenerOptions: {
        maxDepth: number,
        whoisServer: string,
        asSet: string
    },
    resultOptions: Omit<RPSLObject, 'members'>
}

export const config: Configuration = {
    flattenerOptions: {
        maxDepth: 10,
        whoisServer: 'whois.radb.net',
        asSet: 'AS51019:AS-CONE'
    },
    resultOptions: {
        "as-set": "AS51019:AS-CLEAN",
        "descr": "Flattened (cleaned) AS set for AS51019.",
        "org": "ORG-KHR1-RIPE",
        "tech-c": "KA7557-RIPE",
        "admin-c": "KA7557-RIPE",
        "mnt-by": "is-kjartann-1-mnt",
        "source": "RIPE"
    }
};