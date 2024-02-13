#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "-- Test formatter --"
$DIR/formatter.sh
echo "-- Test parser --"
$DIR/parser.sh
echo "-- Test whois --"
$DIR/whois.sh
echo "-- Test resolver --"
$DIR/resolver.sh