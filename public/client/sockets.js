const socket = io(window.location.origin);

const context = new AudioContext;

const keys = {};
let bass = false;

socket.on('start', obj => {

  if (obj.key === 18) { // if key is space, begin vibrato on active notes
    Object.keys(keys).forEach(key => {
      const modulator = context.createOscillator();
      const modulatorGain = context.createGain();

      modulator.frequency.value = 6; // vibrato rate
      modulatorGain.gain.value = 4; // vibrato depth

      modulator.connect(modulatorGain);
      modulatorGain.connect(keys[key][0].frequency);

      modulator.start(0);

      keys[key][2] = modulator;
    });
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
    box.style.backgroundColor = 'pink';
  }
});

socket.on('stopped', ({key}) => {
  if (key === 18) { // if alt/option key is released, remove all vibratos from active notes
    Object.keys(keys).forEach(currKey => {
      if (keys[currKey][2]) {
        console.log(keys[currKey][2]);
        keys[currKey][2].stop(0);
        delete keys[currKey][2];
      }
    });
  } else if (keys[key]) {
    // once key is let go, ramp the gain down to 0 over 0.1 seconds
    keys[key][1].gain.setValueAtTime(0.1, context.currentTime);
    keys[key][1].gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    delete keys[key];
    let box = document.getElementById(`${key}`);
    if (box.className.includes('dark')) box.style.backgroundColor = '#dddddd';
    else box.style.backgroundColor = 'floralwhite';
  }
});

window.addEventListener('keyup', () => {
  let key = event.keyCode;

  if (key === 16) {
    if (recorder.targetKey) {
      storeRecording()
    }
    recorder.isRecording = false
    return
  } else if (key === recorder.targetKey) {
    setTimeout(() => recorder.targetKey = null, 100)
    return
  } 
  console.log(playbackKeys[key])
  if (playbackKeys[key] && playbackKeys[key].length > 0) {
    playbackKeys[key].forEach(({key}) => {
      socket.emit('stop', {key})
    })
    return
  }

  socket.emit('stop', {key: key});
});

window.addEventListener('keydown', () => {
  let freq;
  let key = event.keyCode;

  if (!bass && keyboard[key]) {
    freq = keyboard[key];
  } else if (bass && bassKeyboard[key]) {
    freq = bassKeyboard[key];
  }

  if (freq && recorder.isRecording) {
    record(freq, key)
  } 

  if (key === 16) {
    recorder.isRecording = true
  } else if (recordingKeys.includes(key)) {
    checkRecorder(key)
  }

  if (freq && !keys[key]) {
    socket.emit('note', {freq, key});
  } else if (key === 18) {
    socket.emit('note', {key});
  } else {
    console.log('Do you even play, bro?')
  }
})

const button = document.getElementById('bass');
button.addEventListener('click', () => {
  bass = !bass;
  if (bass) button.innerHTML = 'bass: ON';
  else button.innerHTML = 'bass: OFF';
})
