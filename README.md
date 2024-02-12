# TypeScript AS set flattener

# Project description

This program queries for a specified AS set in an Internet Routing Registry (IRR) database (RADB by default) and recurses through each member, adding each member that matches the syntax of an ASN to a "flattened" AS set while continuing to recurse further into nested AS sets.

This achieves a few things but notably has some desirable benefits:

- The program will check if it has encountered a member before. This means circular references are algorithmically removed. It also means it de-duplicates the resulting flattened AS set automatically.
- Known carrier ASNs are ignored and do not get added to the resulting flattened AS set, giving the user confidence their flattened AS set won't permit a customer to e.g. inject Cloudflare into their AS path.
- Transits with worse filtering than you won't have to traverse deeper than just your flattened AS set, as there are no nested AS sets.

It is written with TypeScript using the Deno runtime.

# Goals

Personal goals:

- [x] Use TypeScript with Deno for the first time.
- [x] Write a useful utility for networkers consisting of quality code.
- [x] Work with data from Internet Routing Registries in a programmatic manner.
- [x] Use recursion for a task where it makes sense.
- [ ] Use testing to validate effectiveness of the code.
- [x] Work with types in TypeScript in a self-documenting manner, namely with branded types.

Project goals:

- [x] Flattening AS sets: remove circular references.
- [x] Flattening AS sets: algorithmically deduplicate the output.
- [x] Flattening AS sets: restrict recursion depth to a user-defined value.
- [x] Flattening AS sets: ignore any tier 1/tier 2/well known carrier networks.
- [ ] Flattening AS sets: ignore any user-defined "banned" networks.
- [ ] Interact with the RIPE/ARIN/LACNIC/APNIC/AFRINIC APIs, auto-dbm or rest, to automatically update the database with the flattened AS set.

Unticked boxes are TODOs, will be completed in due course.

Other TODOs:
- How to run & configure