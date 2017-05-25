const socketFunction = io => {
	io.on('connection', socket => {
		console.log('got connection', socket.id)
		socket.on('clicked', (obj) => {
			console.log(obj.data)
			io.sockets.emit('start', obj)
		})
		socket.on('note', obj => {
			io.sockets.emit('start', obj)
		})
		socket.on('stop', key => {
			io.sockets.emit('stopped', key)
		})
	})
}

module.exports = socketFunction
