import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";
import { flatten } from "./lib/resolver.ts"
import { formatAsSet } from "./lib/formatter.ts";
import { asnSorter } from "./lib/helpers.ts";
import { config } from "./flattener.config.ts";

export interface GlobalInterface {
    verboseMode?: boolean
}

export const global: GlobalInterface = {};

const flags = parseArgs(Deno.args, {
    boolean: ["help", "verbose"]
});

if (flags.help) {
    console.log(`Usage: ${import.meta.filename} [OPTIONS]
Options:
    --help          Show this menu.
    --verbose       Log what the flattener is doing to stdout.`);

    Deno.exit(0);
}

const flattened = await flatten(
    config.flattenerOptions.asSet, 
    config.flattenerOptions.whoisServer,
    flags?.verbose || false
);

console.log(formatAsSet({
    members: [
        "AS51019",
        ...flattened.sort(asnSorter).map(asn => asn.toUpperCase())
    ],
    ...config.resultOptions,
}))