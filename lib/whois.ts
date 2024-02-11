import { OutputMode, exec } from "https://deno.land/x/exec@0.0.5/mod.ts";

export async function whois(
    query: string, 
    opts: {
        server: string,
        port?: number
    }
) {
    const data = await exec(
        `bash -c "echo ${query} | nc ${opts.server} ${opts.port || 43}"`,
        {output: OutputMode.Capture}
    );
    
    return data;
}