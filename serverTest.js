const express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
const port = 80;

app.get('/test', async (req, res) => {
	let foo = await ytdl('https://www.youtube.com/watch?v=4KfC923EFsY')
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})