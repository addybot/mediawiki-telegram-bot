'use strict'

let cache = require('./cache.js');

let fs = require('fs');
var log = require('winston');
let TelegramBot = require('node-telegram-bot-api');
let MediaWiki = require('nodemw');
let pdc = require('pdc');
let remark = require('remark');
let addybot = require('addybot-api');

let telegramToken = fs.readFileSync('TELEGRAM_TOKEN', 'utf8').trim();
let addybotToken = fs.readFileSync('ADDYBOT_TOKEN', 'utf8').trim();

let getAd = addybot(addybotToken);
let bot = new TelegramBot(telegramToken, {polling: true});
let wikiConfig = JSON.parse(fs.readFileSync('config.json', 'utf8').trim());
let wiki = new MediaWiki(wikiConfig);

let articleRegexp = /\/article_(.+)/;
let commonMessageOpts = { 
  parse_mode: 'Markdown', 
  disable_web_page_preview: true
};

let article = (from, id) => {
  let fromId = from.id;
  let userName = from.userName;
  // Send `text` as reply to `fromId`
  let parseArticle = text => {
    let ast = remark.parse(text);
    //console.log(ast);
    let positions = ast.children.map(node => {
      node.position.type = node.type;
      return node.position;
    });
    //console.log(positions);
    // position.start.offset / position.end.offset
    var start = 0;
    var end = 0;
    var blocks = [];
    positions.forEach(pos => {
      if (pos.end.offset - start >= 4000) {
        //console.log(pos.end.offset, start);
        let block = text.substring(start, end+1);
        start = pos.start.offset;
        end = pos.end.offset;
        blocks.push(block);
      } else {
        end = pos.end.offset;
      }
    });
    // Add last block
    blocks.push(text.substring(start, end+1));
    return blocks;
  }
  let sendArticle = blocks => {    
    function sendAd() {
      getAd(fromId + ':' + userName, 'russian').then(ad => {
        bot.sendMessage(fromId, ad.text + '\n' + ad.uri);
      }).catch(error => {
        log.error('Error when receiving ads', error);
      });
    }
    function doSend() {
      let part = blocks.shift();
      if (part) {
        bot.sendMessage(fromId, part, commonMessageOpts);
        setTimeout(doSend, 1000);
      } else {
        //if (Math.random() > 0.5)
        setTimeout(sendAd, 1000)
      }
    }  
    doSend();
  }
  // Read article
  let cached = cache.get(id);
  if (cached) {
    sendArticle(cached);
  } else {
    let title = cache.getTitle(id);
    if (title) {
      wiki.getArticle(title, (err, result) => {
        if (err) throw err;
        pdc(result, 'mediawiki', 'markdown', (err, result) => {
          if (err) throw err;
          let parsed = parseArticle(result);
          cache.set(id, parsed);
          sendArticle(parsed);
        });
      });
    } else {
      bot.sendMessage(fromId, 'Invalid article');
    }
  }
}

let search = (from, query) => {
  let fromId = from.id;
  // Search article
  wiki.search(query, (err, result) => {
    if (err) 
      throw err;
    let links = result.map(item => {
      let title = item.title;
      let id = cache.getId(title);
      return '/article_' + id + ' ' + title;
    });
    if (links.length === 0) {
      bot.sendMessage(fromId, 'Nothing found :(');
    } else {
      let text = links.join('\n');
      bot.sendMessage(fromId, 'I found something for you:\n\n' + text);
    }
  });
}

bot.on('message', (msg) => {
  let from = msg.from;
  if (!msg.text)
    return
  let query = msg.text;
  if (query === "/help") {
    bot.sendMessage(from.id, 
      "Send me message to search article in " + wikiConfig.server);
  } else {
    let match = query.match(articleRegexp);
    if (match) {
      let id = match[1];
      log.info('%s requested article "%s"', 
        telegramUser(from), cache.getTitle(id));
      article(from, id);
    } else {
      log.info('Search request "%s" from %s', 
        query, telegramUser(from));
      search(from, query);
    }  
  }
});

let telegramUser = (from) => {
  return from.id + ':' + from.username;
}

log.info("MediaWiki Bot Started for", wiki.server);
log.info(" - TELEGRAM_TOKEN: ", telegramToken);
log.info(" - ADDYBOT_TOKEN: ", addybotToken, '\n');

