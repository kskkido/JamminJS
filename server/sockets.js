const socketFunction = io => {
	io.on('connection', socket => {
		console.log('got connection', socket.id)
	})
}

module.exports = socketFunction