const socket = io(window.location.origin);

const context = new AudioContext;
const oscillator = context.createOscillator();


socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

socket.on('start', receivedNote => {
  oscillator.frequency.value = receivedNote.freq;
  oscillator.connect(context.destination);
  oscillator.start(0);
})

socket.on('stopped', () => {
  oscillator.stop(0);
})

const button = document.getElementById('button');

button.addEventListener('click', () => {
  socket.emit('clicked', {data: 5})
})

window.addEventListener('keyup', () => {
  socket.emit('stop');
})

window.addEventListener('keydown', () => {
  let freq;
  switch (event.keyCode) {
    case 49:
      freq = 261.63;
      break;
    case 50:
      freq = 277.18;
      break;
    case 51:
      freq = 293.66;
      break;
    case 52:
      freq = 311.13;
      break;
    case 53:
      freq = 329.63;
      break;
    case 54:
      freq = 349.23;
      break;
    case 55:
      freq = 369.99;
      break;
    case 56:
      freq = 392.00;
      break;
    case 57:
      freq = 415.30;
      break;
    case 48:
      freq = 440;
      break;
    case 189:
      freq = 466.16;
      break;
    case 187:
      freq = 493.88;
      break;
    default:
      console.log('Do you even play, bro?')
      console.log(event.keyCode);
  }
  if (freq) {
    socket.emit('note', {freq})
  }
})
