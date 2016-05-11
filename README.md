Introduction
---------------

Welcome to MediaWiki Telegram Bot. This project has two objectives:

1. Make access to any MediaWiki from Telegram
2. Show how to plug [AddyBot](https://addybot.com) ads into your chatbot.

Installation
------------

Project uses [Pandoc](http://pandoc.org) to convert MediaWiki format to Markdown. Pandoc is a standalone application so you should install it manually. Also you obviously need Node.js >= 5.0.0 to run.

For MacOS X

```bash
brew install node
brew install pandoc
``` 

Configure and run
-----------------

To run the bot you need Telegram and AddyBot tokens. You can get them accordingly from @BotFather and AddyBot Cabinet.

```bash
echo -n YOUR_TELEGRAM_TOKEN > TELEGRAM_TOKEN
echo -n YOUR_ADDYBOT_TOKEN > ADDYBOT_TOKEN
```

Edit `config.json` to set MediaWiki server. By default it works with english Wikipedia.

```bash
npm install
npm start
```

Also
------------------

See [addybot-api-js](http://github.com/addybot/addybot-api-js)
