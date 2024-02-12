import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";
import { flatten } from "./lib/resolver.ts"
import { formatAsSet } from "./lib/formatter.ts";
import { asnSorter } from "./lib/helpers.ts";
import { Level, log } from "./lib/logger.ts";

export interface GlobalInterface {
    verboseMode?: boolean,
    maxDepth?: number
}

export const global: GlobalInterface = {};

const flags = parseArgs(Deno.args, {
    string: ["as-set", "max-depth"],
    boolean: ["help", "verbose"]
});
const requiredFlags = [
    "as-set",
    "max-depth"
];

if (flags.help) {
    console.log(`Usage: ${import.meta.filename} [OPTIONS]
Options:
    --help          Show this menu.
    --as-set        The AS set to flatten.          [REQUIRED]
    --max-depth     The maximum recursion depth.    [REQUIRED]`);

    Deno.exit(0);
}

if (flags.verbose) {
    global.verboseMode = true;
}

if (flags["max-depth"]) {
    global.maxDepth = Number(flags["max-depth"]);
}

const missingFlags = [];
for (const flag of requiredFlags) {
    if (!flags[flag]) {
        missingFlags.push(flag);
    }
}

if (missingFlags.length > 0) {
    const flagStr = missingFlags.map(flag => `\`${flag}\``).join(', ');

    log(
        `Missing required flags ${flagStr}. Please run with the --help flag for help.`,
        {
            level: Level.ERROR
        }
    );
    Deno.exit(1);
}

// flags["as-set"] cannot be undefined, that's already been asserted.
const flattened = await flatten(flags["as-set"] as string);

console.log(formatAsSet({
    "as-set": "AS51019:AS-CLEAN",
    "descr": "Flattened (cleaned) AS set for AS51019.",
    members: [
        "AS51019",
        ...flattened.sort(asnSorter)
    ],
    org: "ORG-KHR1-RIPE",
    "tech-c": "KA7557-RIPE",
    "admin-c": "KA7557-RIPE",
    "mnt-by": "is-kjartann-1-mnt",
    "source": "RIPE"
}))