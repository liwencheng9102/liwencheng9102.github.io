# liwencheng9102.github.io
this is my website.
> poison_blog - Simple but not simple blog system

#### Run MongoDB

Please install [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) and [Node.js](https://nodejs.org/en/), then start the database.

```bash
# yourDBpath is your DB folder(anywhere)
$ sudo mongod --dbpath yourDBpath
mongod --dbpath /usr/local/MongoDB/data/db
```

#### Run blog_server

```bash
$ cd Blog_Server

$ npm i 

$ node app.js
```

#### Run poison_blog

```bash
$ cd Poison_Blog

$ npm i 

$ npm run serve 
```

**Tips:** Do not use `localhost` visit the project, because of cookie is domain only support `127.0.0.1`.

