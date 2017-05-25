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


    case 16:
      recorder.isRecording = true
      break;

    case 90:
      if(recorder.isRecording) recorder.targetKey = 90
      else toggleRecordingPlay(90)
      break;

    case 88:
      if(recorder.isRecording) recorder.targetKey = 88
      else toggleRecordingPlay(88)
      break;


    case 67:
      if(recorder.isRecording) recorder.targetKey = 67
      else toggleRecordingPlay(67)
      break;


    case 86:
      if(recorder.isRecording) recorder.targetKey = 86
      else toggleRecordingPlay(86)
      break;

    case 66:
      if(recorder.isRecording) recorder.targetKey = 66
      else toggleRecordingPlay(66)
      break;

    case 78:
      if(recorder.isRecording) recorder.targetKey = 78
      else toggleRecordingPlay(78)
      break;

    case 77:
      if(recorder.isRecording) recorder.targetKey = 77
      else toggleRecordingPlay(77)
      break;

    case 188:
      if(recorder.isRecording) recorder.targetKey = 188
      else toggleRecordingPlay(188)
      break;

    case 190:
      if(recorder.isRecording) recorder.targetKey = 190
      else toggleRecordingPlay(190)
      break;

    case 191:
      if(recorder.isRecording) recorder.targetKey = 191
      else toggleRecordingPlay(191)
      break;

    default:
      console.log('Do you even play, bro?');
  }
  if (freq && !keys[key]) {
    socket.emit('note', {freq, key: event.keyCode});
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
