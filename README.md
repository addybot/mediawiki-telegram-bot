Introduction
---------------

Welcome to MediaWiki Telegram Bot. This project has two objectives:

1. Enable access from Telegram to any MediaWiki instance
2. Show an example how to add [AddyBot](https://addybot.com) ads into your chatbot.

Installation
------------

Project uses [Pandoc](http://pandoc.org) to convert MediaWiki format to Markdown. Pandoc is a standalone application so you have to install it manually. Also you'd obviously need Node.js >= 5.0.0 to run.

For MacOS X

```bash
brew install node
brew install pandoc
``` 

Configure and run
-----------------

To run the bot you'd need Telegram and AddyBot tokens. You can get them from @BotFather and AddyBot Cabinet respectively.

```bash
echo -n YOUR_TELEGRAM_TOKEN > TELEGRAM_TOKEN
echo -n YOUR_ADDYBOT_TOKEN > ADDYBOT_TOKEN
```

Edit `config.json` to set MediaWiki server. It is set to English Wikipedia by default.

```bash
npm install
npm start
```

Also
------------------

See [addybot-api-js](http://github.com/addybot/addybot-api-js)
