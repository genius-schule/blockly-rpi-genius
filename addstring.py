#!/usr/bin/env python
# Adds strings to start and end of line
# Call it with the input filename
import sys

infile = sys.argv[1]
sstart = "'"
send = "\\n\'+"

with open('copyblocks', 'w') as out_file:
    with open(infile, 'r') as in_file:
        for line in in_file:
            if line.strip(): # check if empty
                out_file.write(sstart + line.rstrip('\n') + send + '\n')
