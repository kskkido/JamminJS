const socket = io(window.location.origin);

const context = new AudioContext;

const keys = {};

socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

socket.on('start', obj => {
  const key = obj.key;
  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.value = obj.freq;
  oscillator.connect(context.destination);
  oscillator.start(0);
  keys[key] = oscillator;
})

socket.on('stopped', ({key}) => {
  if (keys[key]) {
    keys[key].stop(0);
    delete keys[key];
  }
})

const button = document.getElementById('button');

button.addEventListener('click', () => {
  socket.emit('clicked', {data: 5})
})

window.addEventListener('keyup', () => {
  let key = event.keyCode;
  socket.emit('stop', {key: key});
})

window.addEventListener('keydown', () => {
  let freq;
  let key = event.keyCode;
  switch (key) {
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

     // Qwertyuiop[] (blues scale in A)
    case 81: // Q
      freq = 195.998; // G2
      break;
    case 87: // W
      freq = 220.000; // A3
      break;
    case 69: // E
      freq = 261.626; // C3
      break;
    case 82: // R
      freq = 293.665; // D3
      break;
    case 84: // T
      freq = 311.127; // Eb3
      break;
    case 89: // Y
      freq = 329.63; // E3
      break;
    case 85: // U
      freq = 392.00; // G3
      break;
    case 73: // I
      freq = 440; // A4
      break;
    case 79: // O
      freq = 523.251; // C4
      break;
    case 80: // P
      freq = 587.330; // D4
      break;
    case 219: // [
      freq = 622.254; // Eb4
      break;
    case 221: // ]
      freq = 659.255; // E4
      break;

    default:
      console.log('Do you even play, bro?')
  }
  if (freq && !keys[key]) {
    socket.emit('note', {freq, key: event.keyCode})
  }
})
