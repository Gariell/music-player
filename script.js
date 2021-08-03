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
const musicPlaylist = document.getElementById("music-playlist");
const musicPlaylistBtn = document.getElementById("music-playlist-btn");

//загрузка параметров звука из local Storage
let LSVolumeLavelValue = localStorage.getItem('LSVolumeLavel');
audio.volume = LSVolumeLavelValue;
volumeRange.value = LSVolumeLavelValue * 100

let loadImagesSongs = true
let loadSongError = false

// названия песен (теперь они в верстке)
// const songs =  ['hey', 'summer', 'ukulele'];

// слежение за песнями
let songIndex = 0;

// инициализация загрузки песни в ДОМ
loadSong(songs[songIndex]);

// обновление деталей песни
cover.onerror = function() {
  cover.src = `images/plug-cover.png`;
}
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
  // activeSong()
}

// создание плейлиста
function loadPlaylist() {
  let res;
  for (var i of songs) {
    if (res !== undefined) { res += '<div class="song-link">' + i + '</div>';
      } else {  res = '<div class="song-link">' + i + '</div>'; }
  }
  if (musicPlaylist) { musicPlaylist.innerHTML = res;}
}
loadPlaylist()

// функция счета времени песни
function audioTimeCounter() {
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }
  intervalAudioTimeCounter = setInterval(() => {
    let audioDuration = audio.duration;
    let timeMinutes = Math.floor(audioDuration / 60);
    let timeSeconds = audioDuration - timeMinutes * 60;
    let timeMinutesCounter = Math.floor(audio.currentTime / 60);
    let timeSecondsCounter = audio.currentTime - timeMinutesCounter * 60;
    audioTime = timeMinutesCounter + ":" + str_pad_left(Math.floor(timeSecondsCounter), '0', 2) + " / " + timeMinutes + ":" + str_pad_left(Math.floor(timeSeconds), '0', 2);
    progressTimes.innerText = audioTime;
    if (debuggingAudio == true) {
      console.log(audioTime);
    }
  }, 500);
}

// функция начала воспроизведения песни
function playSong() {
  clearInterval(intervalAudioTimeCounter);
  setTimeout(() => {
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audioTimeCounter();
    audio.play();
    musicContainer.classList.add('play');    
  }, 10);
}

// функция приостановки воспроизведения песни
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
  clearInterval(intervalAudioTimeCounter);
}

// функция обновления полоски прогресса песни
function updateProgress(e) {
  const {
    duration,
    currentTime
  } = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
}

// функция перемотки песни при клике на полосу прогресса
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// функция записи в localStorage уровня громкости
function setVolumeCoocie() {
  localStorage.setItem('LSVolumeLavel', audio.volume);
}

//регулировка звука
let btnClickvolumevolume = false;
let intervalVolumeListener;
const volumeDeviation = 0.05;
function volumeplus() {
  if (btnClickvolume == true) {
    audio.volume = Math.min(1, audio.volume + volumeDeviation);
    volumeRange.value = audio.volume * 100;
    setVolumeCoocie();
  }
}
function volumeminus() {
  if (btnClickvolume == true) {
    audio.volume = Math.max(0, audio.volume - volumeDeviation);
    volumeRange.value = audio.volume * 100;
    setVolumeCoocie();
  }
}
volumeRange.oninput = function () {
  audio.volume = volumeRange.value / 100;
  setVolumeCoocie();
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')
  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})
volumePlus.addEventListener('mousedown', () => {
  btnClickvolume = true
  intervalVolumeListener = setInterval(volumeplus, 50)
}, false)
volumePlus.addEventListener('mouseup', () => {
  btnClickvolume = false
  clearInterval(intervalVolumeListener)
  setVolumeCoocie()
}, false)
volumeMinus.addEventListener('mousedown', () => {
  btnClickvolume = true
  intervalVolumeListener = setInterval(volumeminus, 50)
}, false)
volumeMinus.addEventListener('mouseup', () => {
  btnClickvolume = false
  clearInterval(intervalVolumeListener)
  setVolumeCoocie()
}, false)
musicPlaylistBtn.addEventListener('click', () => {
  musicPlaylist.classList.toggle("active")
})


// отслеживание клика в плейлисте
let songLinks = musicPlaylist.querySelectorAll('.song-link')
function clearPlaylistActive() {
  for (let index = 0; index < songLinks.length; index++) {
    const element = songLinks[index];
    element.classList.remove('active')
  }
}
for (let index = 0; index < songLinks.length; index++) {
    songLinks[index].onclick = function(){
      loadSong(songs[index]);
      clearPlaylistActive()
      songLinks[index].classList.add('active')
      playSong()
  }
}

// функции переключения песен
function prevSong() {
  songIndex--
  if (songIndex < 0) {
    songIndex = songs.length - 1
  }
  clearInterval(intervalAudioTimeCounter)
  loadSong(songs[songIndex])
  clearPlaylistActive()
  songLinks[songIndex].classList.add('active')
  playSong()
  
}
function nextSong() {
  songIndex++
  if (songIndex > songs.length - 1) {
    songIndex = 0
  }
  clearInterval(intervalAudioTimeCounter)
  loadSong(songs[songIndex])
  clearPlaylistActive()
  songLinks[songIndex].classList.add('active')
  playSong()
}

// события песен
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)
audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
audio.addEventListener('ended', nextSong)


audioTimeCounter()