const {resolve} = require('path')

const express = require('express')
const app = express()

const server = require('http').createServer(app);
server.listen('1337', (req, res, next) => {
	console.log('CONNECTED YO')
})

const socketio = require('socket.io')
const io = socketio(server)
const socket = require('./sockets')
socket(io)

app.use('js', express.static('client'))
app.use(express.static('public'))
