# TypeScript AS set flattener

# Project description

This program queries for a specified AS set in an Internet Routing Registry (IRR) database (RADB by default) and recurses through each member, adding each member that matches the syntax of an ASN to a "flattened" AS set while continuing to recurse further into nested AS sets.

This achieves a few things but notably has some desirable benefits:

- The program will check if it has encountered a member before. This means circular references are algorithmically removed. It also means it de-duplicates the resulting flattened AS set automatically.
- Known carrier ASNs are ignored and do not get added to the resulting flattened AS set, giving the user confidence their flattened AS set won't permit a customer to e.g. inject Cloudflare into their AS path.
- Transits with worse filtering than you won't have to traverse deeper than just your flattened AS set, as there are no nested AS sets.

It is written with TypeScript using the Deno runtime.

# Running

## Configuration

Configuration lives inside the `flattener.config.ts` file. It's typed, so a modern editor will autocomplete available keys & values and let you know of any errors. You'll also be able to see the type definition right above the configuration object.

By default the configuration is fairly sensible. All you would realistically need to edit are the `asSet` and `maxDepth` in `flattenerOptions`. I chose a default maximum depth of `10` almost completely arbitrarily. It just happened to perfectly encompass all ASNs included directly or as children members of my AS set. Your situation may be different, though.

## Deno network permissions

As this project uses the Deno runtime we must adhere to its policy of blocking access to any system resources but those that have been explicitly permitted.

In our case it means we must run the `main.ts` file with the `--allow-net` and `--allow-run` flags. These allow the program to 1) open TCP connections as well as listen for TCP connections (WHOIS test server); and 2) execute commands in the system shell. The latter might seem scary (and it is!) but it is only used for the WHOIS query function. You should inspect what the code does before running it, the WHOIS query code specifically is located in `lib/whois.ts`.

The resulting command to run `main.ts` might then look a little something like this:

```
deno run --allow-net --allow-run main.ts --verbose
```

> Verbose mode logs what the AS set resolver is doing as it recurses through the AS set and its members.

## Run (with Deno)

It's easy enough to run the program with Deno. This is ideal if you'd like to modify the code at all. The following command will do the trick:

```
deno run --allow-net --allow-run main.ts
```

Use the `--verbose` flag to see what it's doing:

```
deno run --allow-net --allow-run main.ts --verbose
```

## Run (standalone)

Releases (as executable binaries) are planned but the method of configuration needs to be adjusted before this can be done. Currently it will simply bundle the TypeScript configuration file into the compiled program bundle, as if it were any other program component.

Still, if you'd like to run this way - perhaps if you don't want to install Deno on a remote server, you can adjust the configuration to your liking and run the following to "compile" the program with Deno's compiler:

```
deno compile --allow-net --allow-run main.ts
```

It should automatically target the platform you're currently on. If you don't want that to happen you can specify a target platform with the `--target` flag, explained in the help menu (`deno compile --help`).

# Goals

Personal goals:

- [x] Use TypeScript with Deno for the first time.
- [x] Write a useful utility for networkers consisting of quality code.
- [x] Work with data from Internet Routing Registries in a programmatic manner.
- [x] Use recursion for a task where it makes sense.
- [x] Use testing to validate effectiveness of the code.
- [x] Work with types in TypeScript in a self-documenting manner, namely with branded types.

Project goals:

- [x] Flattening AS sets: remove circular references.
- [x] Flattening AS sets: algorithmically deduplicate the output.
- [x] Flattening AS sets: restrict recursion depth to a user-defined value.
- [x] Flattening AS sets: ignore any tier 1/tier 2/well known carrier networks.
- [x] Flattening AS sets: ignore any user-defined "banned" networks.
- [ ] Interact with the RIPE/ARIN/LACNIC/APNIC/AFRINIC APIs, auto-dbm or rest, to automatically update the database with the flattened AS set.
- [ ] Distribute a standalone binary network operators can use to easily deploy the software for a CRON job or otherwise.

Unticked boxes are TODOs, will be completed in due course.

# Tests

Tests use the in-built Deno testing library, but, since I am evidently too dumb to get a TCP server to run in the background of a Deno test the tests live in the `tests` folder where a bash script has been created for each of them. This is so I can run the `test-server.ts` file in the background while the test runs, so the WHOIS and resolver tests can both query a test WHOIS server with demo data.

To run all tests type:

```
bash ./tests/all.sh
```

Alternatively you can run the individual test files if you're only interested in one of them.

## Error opening the TCP socket (WHOIS test server)

For reasons unknown to me Deno cannot open a TCP socket on certain systems (including mine, Ubuntu 22.04 LTS) without special permission from the operating system.

The following command is what fixed it for me, though I won't claim to know what it's doing or how it works:

```
sudo setcap CAP_NET_BIND_SERVICE=+eip ~/.deno/bin/deno
```

**Do your own research before running commands you do not know what are.**