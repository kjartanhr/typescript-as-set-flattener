import { parseRPSL } from "./parser.ts";
import { getAsSetMembers } from "./parser.ts";
import { whois } from "./whois.ts";
import { log as vlog } from "./logger.ts";
import { Level } from "./logger.ts";
import { config } from "../flattener.config.ts";

const MATCH_ASN = /(AS\d{1,10}$)/g;
const CARRIERS = config.omit?.carriers?.map(carrier => carrier.toLowerCase());
const BLOCKED = config.omit?.blocked?.map(blocked => blocked.toLowerCase());

const encountered: Array<string> = [];
const flattened: Array<string> = [];
const log: Array<[string, string]> = [];

function recurseAsSet(
    asSet: string,
    depth: number
) {
    // deno-lint-ignore no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (depth > config.flattenerOptions.maxDepth) {
            return reject(`Recursed too deep (depth = ${depth}).`);
        }
    
        if (depth !== 0) encountered.push(asSet.toLowerCase());
    
        const res = await whois(asSet, {server: config.flattenerOptions.whoisServer});
        if (!res.status.success) {
            const msg = `Received non-successful exit code ${res.status.code} when attempting WHOIS query.`;

            vlog(
                msg,
                {level: Level.ERROR, verbose: false}
            );

            return reject(msg);
        }

        const rpsl = parseRPSL(res.output);
        const members = getAsSetMembers(rpsl);
    
        vlog(
            `Currently processing ${asSet} at depth ${depth}.`,
            {level: Level.INFO}
        );
    
        for (const member of members) {
            const IS_ASN = MATCH_ASN.test(member);
            const IS_NEW = !encountered.includes(member.toLowerCase());
            const IS_OMITTED = CARRIERS?.includes(member.toLowerCase()) || BLOCKED?.includes(member.toLowerCase());

            // nessecary "lamda" to do guard clauses
            await (async () => {
                if (IS_OMITTED) {
                    return vlog(
                        `Not processing known carrier or blocked member ${member} in ${asSet}.`,
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
                    
                    encountered.push(member.toLowerCase());
                    flattened.push(member.toLowerCase());

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