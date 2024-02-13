import { bgBrightBlue, bgYellow, bgRed, white, black, bold } from "https://deno.land/std@0.215.0/fmt/colors.ts";

export enum Level {
    INFO,
    WARN,
    ERROR
}

export function log(
    message: string,
    opts: {
        level: Level,
        shouldNotLog?: boolean
    }
) {
    if (opts.shouldNotLog) {
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