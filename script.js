const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');

const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
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
}


function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play')
  playBtn.querySelector('i.fas').classList.add('fa-pause')
  audio.play()
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

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')
  if(isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})


//регулировка звука
const volumeDeviation = 0.05
volumePlus.addEventListener('mousedown', () => {
  audio.volume = Math.min(1, audio.volume + volumeDeviation)
  volumeRange.value = audio.volume * 100
})
volumeMinus.addEventListener('mousedown', () => {
  audio.volume = Math.max(0, audio.volume - volumeDeviation)
  volumeRange.value = audio.volume * 100
})
volumeRange.oninput = function() {
  audio.volume = volumeRange.value / 100
}



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