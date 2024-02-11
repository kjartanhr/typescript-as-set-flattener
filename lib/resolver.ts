import { parseRPSL } from "./parser.ts";
import { getAsSetMembers } from "./parser.ts";
import { whois } from "./whois.ts";
import { log as vlog } from "./logger.ts";
import { Level } from "./logger.ts";

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
            {
                level: Level.INFO
            }
        );
    
        for (const member of members) {
            const IS_ASN = MATCH_ASN.test(member);
            const IS_NEW = !encountered.includes(member);
    
            if (!IS_ASN && IS_NEW) {
                vlog(
                    `Processing valid member ${member} of ${asSet}.`,
                    {
                        level: Level.INFO
                    }
                );

                try {
                    await recurseAsSet(
                        member, 
                        depth + 1
                    );
                } catch (e) {
                    log.push([member, e]);
                }
            } else if (IS_ASN && IS_NEW) {
                vlog(
                    `Populating ASN ${member} in ${asSet}.`,
                    {
                        level: Level.INFO
                    }
                );
                
                encountered.push(member);
                flattened.push(member);
            } else {
                vlog(
                    `Not processing previously encountered member ${member} of ${asSet}.`,
                    {
                        level: Level.INFO
                    }
                );
            }
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