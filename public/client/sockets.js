const socket = io(window.location.origin);
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
socket.on('log', obj => console.log(obj.data))

const button = document.getElementById('button');

button.addEventListener('click', () => {
  socket.emit('clicked', {data: 5})
})
