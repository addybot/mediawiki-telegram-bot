'use strict'

var lastArticleId = 0;
let titleIndex = {}; // Map[GeneratedId, ArticleTitle] 
let titleIndexRev = {}; // Map[ArticleTitle, GeneratedId]
let cache = {};

module.exports.get = (id) => {
  let cached = cache[id];
  if (cached) {
    return cached.concat();
  } else {
    return null;
  }  
}

module.exports.set = (id, data) => {
  cache[id] = data.concat();
}

module.exports.getTitle = (id) => {
  return titleIndex[id];
}  

module.exports.getId = (title) => {
  var id = titleIndexRev[title];
  if (id) {
    return id;
  } else {
    id = lastArticleId++;
    titleIndex[id] = title;
    titleIndexRev[title] = id;
    return id;
  }  
}