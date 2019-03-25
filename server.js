const express = require('express');

const actionsRouter = require('./actions/actionsRouter');
const projectsRouter = require('./projects/projectsRouter');

const server = express();

server.use(express.json());

server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);

module.exports = server;