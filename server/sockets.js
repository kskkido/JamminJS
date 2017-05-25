const socketFunction = io => {
	io.on('connection', socket => {
		console.log('got connection', socket.id)
		socket.on('clicked', (obj) => {
			console.log(obj.data)
			io.sockets.emit('start', obj)
		})
		socket.on('note', note => {
			io.sockets.emit('start', note)
		})
		socket.on('stop', () => {
			io.sockets.emit('stopped')
		})
	})
}

module.exports = socketFunction
