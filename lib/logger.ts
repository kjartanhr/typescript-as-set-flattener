import { bgBrightBlue, bgYellow, bgRed, white, black, bold } from "https://deno.land/std@0.215.0/fmt/colors.ts";
import { global } from "../main.ts";

export enum Level {
    INFO,
    WARN,
    ERROR
}

export function log(
    message: string,
    opts: {
        level: Level,
        verbose?: boolean
    }
) {
    if (opts.verbose && !global.verboseMode) {
        return;
    }

    const dstring = `[${new Date().toLocaleString()}]`;

    switch (opts.level) {
        case Level.INFO:
            console.log(
                bgBrightBlue(
                    white(
                        bold(
                            "INFO "
                        )
                    )
                ),
                dstring,
                message
            );
            break;

        case Level.WARN:
            console.log(
                bgYellow(
                    black(
                        bold(
                            "WARN "
                        )
                    )
                ),
                dstring,
                message
            );
            break;

        case Level.ERROR:
            console.log(
                bgRed(
                    white(
                        bold(
                            "ERROR"
                        )
                    )
                ),
                dstring,
                message
            );
            break;
    }     
}