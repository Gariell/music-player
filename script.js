const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');

const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressTimes = document.querySelector('#progressTime');
const progressTimesCounter = document.querySelector('#progressTimeCounter');
const progressContainer = document.querySelector('.progress-container');

const title = document.querySelector('#title');
const cover = document.querySelector('#cover');

const volumePlus = document.querySelector('#volumePlus');
const volumeMinus = document.querySelector('#volumeMinus');

const volumeRange = document.getElementById("volumeRange");
const volumeRangeOutput = volumeRange / 100

// названия песен
const songs = ['hey', 'summer', 'ukulele'];

// слежение за песнями
let songIndex = 1;

// инициализация загрузки песни в ДОМ
loadSong(songs[songIndex]);

// обновление деталей песни
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
  audioTimeCounter()
}

function audioTimeCounter() {

  function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }
  
  setInterval(() => {


    let audioDuration = audio.duration
    let timeMinutes = Math.floor(audioDuration / 60);
    let timeSeconds = audioDuration - timeMinutes * 60;
    progressTimes.innerText = timeMinutes + ":" + Math.floor(timeSeconds)
    let timeMinutesCounter = Math.floor(audio.currentTime / 60);
    let timeSecondsCounter = audio.currentTime - timeMinutesCounter * 60;
    progressTimesCounter.innerHTML = timeMinutesCounter + ":" + str_pad_left(Math.floor(timeSecondsCounter),'0',2)

  }, 100);
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play')
  playBtn.querySelector('i.fas').classList.add('fa-pause')
  audio.play()
  audioTimeCounter()
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play')
  playBtn.querySelector('i.fas').classList.remove('fa-pause')
  audio.pause()
}

function updateProgress(e) {
  const {duration, currentTime} = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
  
}

function setProgress (e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const duration = audio.duration
  audio.currentTime = (clickX / width) * duration
  
}

//регулировка звука
let btnClick = false
let intervalVolumeListener
const volumeDeviation = 0.05

function volumeplus() {

  if(btnClick == true) {
    audio.volume = Math.min(1, audio.volume + volumeDeviation)
    volumeRange.value = audio.volume * 100
  }
}
function volumeminus() {
  if(btnClick == true) {
    audio.volume = Math.max(0, audio.volume - volumeDeviation)
    volumeRange.value = audio.volume * 100
  }
}

volumePlus.addEventListener('mousedown', () => {
  btnClick = true
  intervalVolumeListener = setInterval(volumeplus, 50)
}, false)

volumePlus.addEventListener('mouseup', () => {
  btnClick = false
  clearInterval(intervalVolumeListener)
}, false)

volumeMinus.addEventListener('mousedown', () => {
  btnClick = true
  intervalVolumeListener = setInterval(volumeminus, 50)
}, false)

volumeMinus.addEventListener('mouseup', () => {
  btnClick = false
  clearInterval(intervalVolumeListener)
}, false)

volumeRange.oninput = function() {
  audio.volume = volumeRange.value / 100
}



// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')
  if(isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

// функции переключения песен
function prevSong() {
  songIndex--
  if(songIndex < 0) {
    songIndex = songs.length - 1
  }
  loadSong(songs[songIndex])
  playSong()
}
function nextSong() {
  songIndex++
  if(songIndex > songs.length - 1) {
    songIndex = 0
  }
  loadSong(songs[songIndex])
  playSong()
}

// события песен
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)
audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
audio.addEventListener('ended', nextSong)
audioTimeCounter()
