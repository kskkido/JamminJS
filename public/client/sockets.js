const socket = io(window.location.origin);

const context = new AudioContext;

const keys = {};

socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

socket.on('start', obj => {

  if (obj.key === 32) {
    console.log("objectkeys", Object.keys(keys));
    Object.keys(keys).forEach(key => {
      const modulator = context.createOscillator();
      modulator.frequency.value = 6; // vibrato rate

      const modulatorGain = context.createGain();
      modulatorGain.gain.value = 2; // vibrato depth
      modulator.connect(modulatorGain);
      console.log("key[0]", keys[key][0])
      modulatorGain.connect(keys[key][0].frequency);

      modulator.start(0);
    })
  } else {
    // create main oscillator
    const mainOSC = context.createOscillator();
    mainOSC.type = 'triangle';
    mainOSC.frequency.value = obj.freq;

    const envelope = context.createGain();
    envelope.gain = 0;
    mainOSC.connect(envelope);
    envelope.connect(context.destination);
    mainOSC.start(0); // start main OSC silently
    envelope.gain.setValueAtTime(0.1, context.currentTime); // gain of -20db

    // push oscillator and gain objects to keys store
    keys[obj.key] = [mainOSC, envelope];

    // set front end view
    let box = document.getElementById(`${obj.key}`);
    box.style.backgroundColor = 'purple';
  }

});

socket.on('stopped', ({key}) => {
  // console.log('keyobj', keys[key]);
  if (keys[key]) {
    // once key is let go, ramp the gain down to 0 over 0.1 seconds
    keys[key][1].gain.setValueAtTime(0.1, context.currentTime);
    keys[key][1].gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
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
    case 32: // space
      freq = 440;
      break;

    default:
      console.log('Do you even play, bro?');
  }
  if (freq && !keys[key]) {
    socket.emit('note', {freq, key: event.keyCode});
  }
});
