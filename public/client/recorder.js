// get oscilators
// find playing while recorder is toggled
//

const recorder = {isRecording: false, targetKey: null}
const playbackKeys = {
	90: [],
	88: [],
	67: [],
	86: [],
	66: [],
	78: [],
	77: [],
	188: [],
	190: [],
	191: [],
}

let frequencyHash = {}

function storeRecording() {
  const targetKey = recorder.targetKey

  if (playbackKeys[targetKey].length > 0) {
     clearRecording(targetKey)
  }
  
  const keyList = Object.keys(frequencyHash)
  for (const key of keyList) {
    const freq = frequencyHash[key]
    playbackKeys[targetKey].push({freq, key})
  }

  frequencyHash = {}
}

function recordTo(freq, key) {
  if(!frequencyHash[key]) {
    frequencyHash[key] = freq
  }
}

function checkRecorder (targetKey) {
  if (recorder.isRecording) {
    recorder.targetKey = targetKey
  } else {
    toggleRecordingPlay(targetKey)
  }
}

function toggleRecordingPlay(targetKey) {
  if (playbackKeys[targetKey].length > 0) {
    playbackKeys[targetKey].forEach(({freq, key}) => {
      socket.emit('note', {freq, key})
    })
  }
}

function clearRecording(targetKey) {
  playbackKeys[targetKey].forEach(freqKey => delete freqKey)
  playbackKeys[targetKey] = []
}
