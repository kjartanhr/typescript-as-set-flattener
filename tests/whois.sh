#!/bin/bash

deno run --allow-net ./lib/test-server.ts &
export PID=$!

deno test --allow-run ./lib/whois_test.ts

kill $PID
