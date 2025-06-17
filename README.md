# gpm-music-lib-metadata-export
(repo formerly named "gpm_metadata_export")

### Description

Tooling to export and download metadata of my library of music tracks 
uploaded to Google Play Music, before Google discontinues GPM in favor of youTube Music, 
which has less functionalities and user metadata.

**playcounts** is of most interest in particular.

#### Metadata Columns
- artist
- album
- title
- duration
- playcount
- rating

## Processing Steps
1. double-pipe delimited
2. remove double-quotes
3. manual cleanup for len>300 fields:
  3.1.  vk.xyz or something plus russian/foreign text that was messing up parsing
     3.1.1. zedd-true colors (grey remix)
     3.1.2. getter - Suh Dude (LUMBERJVCK Remix)
  3.2. +/- -> plus sign interpreted as operator in gsheets
  3.3.

### Changes to src

See: playlist_ui_scraper2.js

1. removed `\t`.
2. append `trim()` to all scraped fields to remove trailing spaces.
3. change delimiter from comma to double-pipe to account for non-delimiting commas in exported data.
