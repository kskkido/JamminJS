// get oscilators
// find playing while recorder is toggled
//

const recorder = {isRecording: false, recordingKey: null}
const recorderKeys = {
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
  console.log(frequencyHash)
  const recordingKey = recorder.recordingKey
  if (recorderKeys[recordingKey].length > 0) {
     clearRecording(recordingKey)
  }
  
  const keyList = Object.keys(frequencyHash)
  for (const key of keyList) {
    const freq = frequencyHash[key]
    recorderKeys[recordingKey].push({freq, key})
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
    recorder.recordingKey = targetKey
  } else {
    toggleRecordingPlay(targetKey)
  }
}

function toggleRecordingPlay(targetKey) {
  if (recorderKeys[targetKey].length > 0) {
    recorderKeys[targetKey].forEach(({freq, key}) => {
      socket.emit('note', {freq, key})
    })
  }
}

function clearRecording(targetKey) {
  recorderKeys[targetKey].frequencies = []
  recorderKeys[targetKey].isPlaying = false
}

function turnOnRecording() {
  console.log('fucks')
  recorder.isRecording = true
}