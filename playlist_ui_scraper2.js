// Processing Steps Quick Reference:
// 1. double-pipe delimited
// 2. remove double-quotes
// 3. manual cleanup for len>300 fields:
  // 3.1. zedd-true colors (grey remix) -> album name messing up parsing
  // 3.2. +/- -> plus sign interpreted as operator in gsheets

// Ref: https://gist.github.com/dcalacci/7f8853174797c0c56c49

var allsongs = []
var songsToText = function(style, csv, likedonly){
  if (style === undefined){
    console.log("style is undefined.");
    return;
  }
  var csv = csv || false; // defaults to false
  var likedonly = likedonly || false; // defaults to false
  if (likedonly) {
    console.log("Only selecting liked songs");
  }
  if (style == "all" && !csv){
    console.log("Duration, ratings, and playcount will only be exported with the CSV flag");
  }
  var outText = "";
  if (csv) {
    if (style == "all") {
      //extra line
      outText = "index||artist||album||title||duration||playcount||rating" + "\n";
    } else if (style == "artist") {
    } else if (style == "artistsong") {
    } else if (style == "artistalbum") {
    } else if (style == "artistalbumsong") {
    } else {
      console.log("style not defined");
    }
  }
  var numEntries = 0;
  var seen = {};
  for (var i = 0; i < allsongs.length; i++) {
    var curr = "";
    if (!likedonly || (likedonly && allsongs[i].rating >= 5)){
      if (csv) {
        if (style == "all") {
          //extra line
          curr = allsongs[i].artist.trim() + "||";
          curr += allsongs[i].album.trim() + "||";
          curr += allsongs[i].title.trim() + "||";
          curr += allsongs[i].duration.trim() + "||";
          curr += allsongs[i].index.trim() + "||";
          curr += allsongs[i].playcount.trim() + "||";
          curr += allsongs[i].rating.trim();
        } else if (style == "artist") {
          curr = allsongs[i].artist.trim();
        } else if (style == "artistsong") {
          curr = allsongs[i].artist.trim() + "||";
          curr += allsongs[i].title.trim();
        } else if (style == "artistalbum") {
          curr = allsongs[i].artist.trim() + "||";
          curr += allsongs[i].album.trim();
        } else if (style == "artistalbumsong") {
          curr = allsongs[i].artist.trim() + "||";
          curr += allsongs[i].album.trim() + "||";
          curr += allsongs[i].title.trim();
        } else {
          console.log("style not defined");
        }
      } else {
        if (style == "all"){
          curr = "";
          curr += (allsongs[i].index.trim().length > 0 ? allsongs[i].index.trim() + ". " : "");
          curr += allsongs[i].artist.trim() + " - ";
          curr += allsongs[i].album.trim() + " - ";
          curr += allsongs[i].title.trim();
        } else if (style == "artist"){
          curr = allsongs[i].artist.trim();
        } else if (style == "artistalbum"){
          curr = allsongs[i].artist.trim() + " - " + allsongs[i].album.trim();
        } else if (style == "artistsong"){
          curr = allsongs[i].artist.trim() + " - " + allsongs[i].title.trim();
        } else if (style == "artistalbumsong"){
          curr = allsongs[i].artist.trim() + " - " + allsongs[i].album.trim() + " - " + allsongs[i].title.trim();
        } else {
          console.log("style not defined");
        }
      }
      if (!seen.hasOwnProperty(curr)){ // hashset
        outText = outText + curr + "\n";
        numEntries++;
        seen[curr] = true;
      } else {
        console.log("Skipping (duplicate) " + curr);
      }
    }
  }
  copy(outText);
  console.log("Done! " + numEntries + " lines copied to clipboard. Used " + numEntries + " songs out of " + allsongs.length + ".");
};
var scrapeSongs = function(){
  var intervalms = 1; //in ms
  var timeoutms = 3000; //in ms
  var retries = timeoutms / intervalms;
  var total = [];
  var seen = {};
  var topId = "";
  var interval = setInterval(function(){
    var songs = document.querySelectorAll("table.song-table tbody tr.song-row");
    if (songs.length > 0) {
      // detect order
      var colNames = {
        index: -1,
        title: -1,
        duration: -1,
        artist: -1,
        album: -1,
        playcount: -1,
        rating: -1
        };
      for (var i = 0; i < songs[0].childNodes.length; i++) {
        colNames.index = songs[0].childNodes[i].getAttribute("data-col") == "index" ? i : colNames.index;
        colNames.title = songs[0].childNodes[i].getAttribute("data-col") == "title" ? i : colNames.title;
        colNames.duration = songs[0].childNodes[i].getAttribute("data-col") == "duration" ? i : colNames.duration;
        colNames.artist = songs[0].childNodes[i].getAttribute("data-col") == "artist" ? i : colNames.artist;
        colNames.album = songs[0].childNodes[i].getAttribute("data-col") == "album" ? i : colNames.album;
        colNames.playcount = songs[0].childNodes[i].getAttribute("data-col") == "play-count" ? i : colNames.playcount;
        colNames.rating = songs[0].childNodes[i].getAttribute("data-col") == "rating" ? i : colNames.rating;
      }
      // check if page has updated/scrolled
      var currId = songs[0].getAttribute("data-id");
      if (currId == topId){ // page has not yet changed
        retries--;
        scrollDiv = document.querySelector("div#music-content");
        isAtBottom = scrollDiv.scrollTop == (scrollDiv.scrollHeight - scrollDiv.offsetHeight)
        if (isAtBottom || retries <= 0) {
          clearInterval(interval); //done
          allsongs = total;
          console.log("Got " + total.length + " songs and stored them in the allsongs variable.");
          console.log("Calling songsToText with style all, csv flag true, likedonly false: songsToText(\"all\", false).");
          songsToText("all", false, false);
        }
      } else {
        retries = timeoutms / intervalms;
        topId = currId;
        // read page
        for (var i = 0; i < songs.length; i++) {
          var curr = {
            dataid: songs[i].getAttribute("data-id"),
            index: (colNames.index != -1 ? songs[i].childNodes[colNames.index].textContent : ""),
            title: (colNames.title != -1 ? songs[i].childNodes[colNames.title].textContent : ""),
            duration: (colNames.duration != -1 ? songs[i].childNodes[colNames.duration].textContent : ""),
            artist: (colNames.artist != -1 ? songs[i].childNodes[colNames.artist].textContent : ""),
            album: (colNames.album != -1 ? songs[i].childNodes[colNames.album].textContent : ""),
            playcount: (colNames.playcount != -1 ? songs[i].childNodes[colNames.playcount].textContent : ""),
            rating: (colNames.rating != -1 ? songs[i].childNodes[colNames.rating].textContent : ""),
            }
          if (!seen.hasOwnProperty(curr.dataid)){ // hashset
            total.push(curr);
            seen[curr.id] = true;
          }
        }
        songs[songs.length-1].scrollIntoView(true); // go to next page
      }
    }
  }, intervalms);
};
scrapeSongs();
// for the full CSV version you can now call songsToText("all", true);
