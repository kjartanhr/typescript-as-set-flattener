import { parseRPSL } from "./parser.ts";
import { getAsSetMembers } from "./parser.ts";
import { whois } from "./whois.ts";
import { log as vlog } from "./logger.ts";
import { Level } from "./logger.ts";
import { config } from "../flattener.config.ts";

const CARRIERS = config.omit?.carriers?.map(carrier => carrier.toLowerCase());
const BLOCKED = config.omit?.blocked?.map(blocked => blocked.toLowerCase());

const encountered: Array<string> = [];
const flattened: Array<string> = [];
const log: Array<[string, string]> = [];

function isASN(
    str: string
) {
    const as = Number(str.substring(2, str.length));

    return str[0].toLowerCase() === "a"
        && str[1].toLowerCase() === "s"
        && typeof as === "number"
        && !isNaN(as);
}

function recurseAsSet(
    asSet: string,
    depth: number,
    whoisServer: string,
    verbose: boolean
) {
    // deno-lint-ignore no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (depth > config.flattenerOptions.maxDepth) {
            return reject(`Recursed too deep (depth = ${depth}).`);
        }
    
        if (depth !== 0) encountered.push(asSet.toLowerCase());
    
        const res = await whois(asSet, {server: whoisServer});
        if (!res.status.success) {
            const msg = `Received non-successful exit code ${res.status.code} when attempting WHOIS query.`;

            vlog(
                msg,
                {level: Level.ERROR}
            );

            return reject(msg);
        }

        const rpsl = parseRPSL(res.output);
        const members = getAsSetMembers(rpsl);
    
        vlog(
            `Currently processing ${asSet} at depth ${depth}.`,
            {level: Level.INFO, shouldNotLog: !verbose}
        );
    
        for (const member of members) {
            const IS_ASN = isASN(member);
            const IS_NEW = !encountered.includes(member.toLowerCase());
            const IS_OMITTED = CARRIERS?.includes(member.toLowerCase()) || BLOCKED?.includes(member.toLowerCase());

            // nessecary "lamda" to do guard clauses
            await (async () => {
                if (IS_OMITTED) {
                    return vlog(
                        `Not processing known carrier or blocked member "${member}" of "${asSet}".`,
                        {level: Level.INFO, shouldNotLog: !verbose}
                    );
                }

                if (!IS_NEW) {
                    return vlog(
                        `Not processing previously encountered member "${member}" of "${asSet}".`,
                        {level: Level.INFO, shouldNotLog: !verbose}
                    );
                }

                if (IS_ASN) {
                    vlog(
                        `Populating member ASN "${member}" of "${asSet}".`,
                        {level: Level.INFO, shouldNotLog: !verbose}
                    );
                    
                    encountered.push(member.toLowerCase());
                    flattened.push(member.toLowerCase());

                    return;
                }

                if (!IS_ASN) {
                    vlog(
                        `Processing member AS set "${member}" of "${asSet}".`,
                        {level: Level.INFO, shouldNotLog: !verbose}
                    );
    
                    try {
                        await recurseAsSet(
                            member, 
                            depth + 1,
                            whoisServer,
                            verbose
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
    asSet: string,
    whoisServer: string,
    verbose: boolean
) {
    try {
        await recurseAsSet(
            asSet,
            0,
            whoisServer,
            verbose
        );
    } catch (e) {
        log.push([asSet, e]);
    }
    
    return flattened;
}