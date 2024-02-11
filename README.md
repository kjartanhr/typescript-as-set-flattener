# TypeScript AS set flattener

# Project description

...

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
- [ ] Flattening AS sets: ignore any tier 1/tier 2/well known carrier networks.
- [ ] Flattening AS sets: ignore any user-defined "banned" networks.
- [ ] Interact with the RIPE/ARIN/LACNIC/APNIC/AFRINIC APIs, auto-dbm or rest, to automatically update the database with the flattened AS set.

Unticked boxes are TODOs, will be completed in due course.

Other TODOs:
- Finish README
- License
- How to run & configure