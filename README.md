# gpm_metadata_export

## processing steps
1. double-pipe delimited
2. remove double-quotes
3. manual cleanup for len>300 fields:
  3.1.  vk.xyz or something plus russian text that was messing up parsing
     3.1.1. zedd-true colors (grey remix)
     3.1.2. getter - Suh Dude (LUMBERJVCK Remix)
  3.2. +/- -> plus sign interpreted as operator in gsheets

## references
edited from src: https://gist.github.com/dcalacci/7f8853174797c0c56c49

## changes to src
1. removed \t
2. append trim() to all scraped fields
3. change delimiter from comma to double-pipe
