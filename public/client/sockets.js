const socket = io(window.location.origin);

const context = new AudioContext;
const recorder = {isRecording: false, targetKey: null}

const keys = {};

const recorderKeys = {
  90: {frequencies: [], isPlaying: false},
  88: {frequencies: [], isPlaying: false},
  67: {frequencies: [], isPlaying: false},
  86: {frequencies: [], isPlaying: false},
  66: {frequencies: [], isPlaying: false},
  78: {frequencies: [], isPlaying: false},
  77: {frequencies: [], isPlaying: false},
  188: {frequencies: [], isPlaying: false},
  190: {frequencies: [], isPlaying: false},
  191: {frequencies: [], isPlaying: false}
}

socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

socket.on('start', obj => {

  if (obj.key === 32) { // if key is space, begin vibrato on active notes
    Object.keys(keys).forEach(key => {
      const modulator = context.createOscillator();
      const modulatorGain = context.createGain();

      modulator.frequency.value = 6; // vibrato rate
      modulatorGain.gain.value = 4; // vibrato depth

      modulator.connect(modulatorGain);
      modulatorGain.connect(keys[key][0].frequency);

      modulator.start(0);
    })
  } else {
    // create main oscillator
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = obj.freq;

    const envelope = context.createGain();
    envelope.gain = 0;
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(0); // start main OSC silently
    envelope.gain.setValueAtTime(0.1, context.currentTime); // gain of -20db

    // push oscillator and gain objects to keys store
    keys[obj.key] = [oscillator, envelope];

    // set front end view
    let box = document.getElementById(`${obj.key}`);
    box.style.backgroundColor = 'purple';
  }

});

socket.on('stopped', ({key}) => {
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
  if (key === 16) {
    if (recorder.targetKey) {
      recordTo(recorder.targetKey)
    }
    console.log(recorder)
    recorder.targetKey = null
    recorder.isRecording = false
    return
  }

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
    socket.emit('note', {freq, key});
  } else if (key === 32) {
    socket.emit('note', {key});
  }
});


function recordTo(targetKey) {
  const keyList = Object.keys(keys)
  console.log(keys)

  if (recorderKeys[targetKey].length > 0) {
    clearRecording(targetKey)
  }

  for (const key in keyList) {
    const freq = 440
    console.log(freq)
    if (freq) {
      recorderKeys[targetKey].frequencies.push({freq, key})
    }
  }
}

function toggleRecordingPlay(targetKey) {
  const isPlaying = recorderKeys[targetKey].isPlaying
  console.log(recorderKeys[targetKey])
  recorderKeys[targetKey].frequencies.forEach(({freq, key}) => {
    isPlaying ? socket.emit('stop', {key}) : socket.emit('start', {freq, key})
  })
}

function clearRecording(targetKey) {
  recorderKeys[targetKey].frequencies = []
  recorderKeys[targetKey].isPlaying = false
}
