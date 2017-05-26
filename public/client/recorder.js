// get oscilators
// find playing while recorder is toggled
//

const recorder = {isRecording: false, targetKey: null}
const frequencyHash = {}

let playbackIsPlaying = false
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

function storeRecording() {
  const targetKey = recorder.targetKey

  if (playbackKeys[targetKey].length > 0) {
     clearRecording(targetKey)
  }
  
  const keyList = Object.keys(frequencyHash)
  for (const key of keyList) {
    const freq = frequencyHash[key]
    playbackKeys[targetKey].push({freq, key})
    delete frequencyHash[key]
  }

}

function record(freq, key) {
  if(!frequencyHash[key]) {
    frequencyHash[key] = freq
  }
}

function checkRecorder(targetKey) {
  if (recorder.isRecording) {
    recorder.targetKey = targetKey
  } else {
    playRecording(targetKey)
  }
}

function playRecording(targetKey) {
  if (!playbackIsPlaying && playbackKeys[targetKey].length > 0) {
    playbackKeys[targetKey].forEach(({freq, key}) => {
      socket.emit('note', {freq, key})
    })
    playbackIsPlaying = true
  }
}

function clearRecording(targetKey) {
  playbackKeys[targetKey].forEach(freqKey => delete freqKey)
  playbackKeys[targetKey] = []
}
