const socketFunction = io => {
	io.on('connection', socket => {
		console.log('got connection', socket.id)
		socket.on('clicked', (obj) => {
			console.log(obj.data)
			io.sockets.emit('log', obj)
		})
	})
}

module.exports = socketFunction
