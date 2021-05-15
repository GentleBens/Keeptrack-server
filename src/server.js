'use strict';

const express = require('express');
const app = express();
let server = require('http').createServer(app);





module.exports = {
    server: server,
    start: PORT => {
      if (!PORT) { throw new Error('cannot find port'); }
      server.listen(PORT, () => {
        console.log(`server up on ${PORT}`);
      });
    },
  };