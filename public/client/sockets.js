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
  let box = document.getElementById(`${key}`);
  box.style.backgroundColor = 'purple';
});

socket.on('stopped', ({key}) => {
  if (keys[key]) {
    keys[key].stop(0);
    delete keys[key];
    let box = document.getElementById(`${key}`);
    box.style.backgroundColor = 'pink';
  }
});

window.addEventListener('keyup', () => {
  let key = event.keyCode;
  socket.emit('stop', {key: key});
});

window.addEventListener('keydown', () => {
  let freq;
  let key = event.keyCode;

  if (chromatic[key]) {
    freq = chromatic[key];
  } else if (aBlues[key]) {
    freq = aBlues[key];
  } else {
    console.log('Do you even play, bro?')
  }

  if (freq && !keys[key]) {
    socket.emit('note', {freq, key: event.keyCode});
  }
});
