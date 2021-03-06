'use strict';

function configure (app, wares, ctx) {
  var express = require('express')
    , api = express.Router( )
    ;

  api.post('/notifications/pushovercallback', function (req, res) {
    if (ctx.pushnotify.pushoverAck(req.body)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

  if (app.enabled('api')) {
    // Create and store new sgv entries
    api.get('/notifications/ack', wares.verifyAuthorization, function (req, res) {
      var level = Number(req.query.level);
      var group = req.query.group || 'default';
      var time = req.query.time && Number(req.query.time);
      console.info('got api ack, level: ', level, ', time: ', time, ', query: ', req.query);
      ctx.notifications.ack(level, group, time, true);
      res.sendStatus(200);
    });
  }

  return api;
}
module.exports = configure;
