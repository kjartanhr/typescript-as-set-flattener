import { parseRPSL } from "./parser.ts";
import { getAsSetMembers } from "./parser.ts";
import { whois } from "./whois.ts";
import { log as vlog } from "./logger.ts";
import { Level } from "./logger.ts";
import { CARRIER_ASNS } from "../data/asSet.ts";

const encountered: Array<string> = [];
const flattened: Array<string> = [];
const log: Array<[string, string]> = [];

function recurseAsSet(
    asSet: string,
    depth: number
) {
    // deno-lint-ignore no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const MATCH_ASN = /(AS\d{1,10}$)/g;

        if (depth > 10) return reject(`too deep (depth = ${depth})`);
    
        if (depth !== 0) encountered.push(asSet);
    
        const members = getAsSetMembers(
            parseRPSL(
                (await whois(asSet, {server: 'whois.radb.net'})).output
            )
        );
    
        vlog(
            `Currently processing ${asSet} at depth ${depth}.`,
            {level: Level.INFO}
        );
    
        for (const member of members) {
            const IS_ASN = MATCH_ASN.test(member);
            const IS_NEW = !encountered.includes(member);
            const IS_CARRIER_ASN = CARRIER_ASNS.includes(member);

            // nessecary "lamda" to do guard clauses
            await (async () => {
                if (IS_CARRIER_ASN) {
                    return vlog(
                        `Not processing known carrier ASN ${member} in ${asSet}.`,
                        {level: Level.INFO}
                    );
                }

                if (!IS_NEW) {
                    return vlog(
                        `Not processing previously encountered member ${member} of ${asSet}.`,
                        {level: Level.INFO}
                    );
                }

                if (IS_ASN) {
                    vlog(
                        `Populating ASN ${member} in ${asSet}.`,
                        {level: Level.INFO}
                    );
                    
                    encountered.push(member);
                    flattened.push(member);

                    return;
                }

                if (!IS_ASN) {
                    vlog(
                        `Processing valid member ${member} of ${asSet}.`,
                        {level: Level.INFO}
                    );
    
                    try {
                        await recurseAsSet(
                            member, 
                            depth + 1
                        );
                    } catch (e) {
                        log.push([member, e]);
                    }

                    return;
                }
            })();
        }

        return resolve(depth);
    });
}

export async function flatten(
    asSet: string
) {
    try {
        await recurseAsSet(
            asSet,
            0
        );
    } catch (e) {
        log.push([asSet, e]);
    }
    
    return flattened;
}