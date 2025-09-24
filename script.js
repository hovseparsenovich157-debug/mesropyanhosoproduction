document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('playerVideo');
  const playBtn = document.getElementById('playBtn');
  const muteBtn = document.getElementById('muteBtn');
  const fsBtn = document.getElementById('fsBtn');
  const volume = document.getElementById('vol');
  const progress = document.getElementById('progress');
  const progressFilled = document.getElementById('progressFilled');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');
  const controlsRow = document.querySelector('.controls-row');

  if(!video) return;

  // по умолчанию кастомный плеер
  video.controls = false;

  // Play / Pause
  if(playBtn){
    playBtn.addEventListener('click', ()=>{
      if(video.paused){
        video.play().catch(()=>{});
        playBtn.textContent = '⏸';
      } else {
        video.pause();
        playBtn.textContent = '▶';
      }
    });
  }

  // Mute toggle
  if(muteBtn){
    muteBtn.addEventListener('click', ()=>{
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
  }

  // Volume slider
  if(volume){
    volume.addEventListener('input', ()=>{
      const v = parseFloat(volume.value);
      if(!isNaN(v)){
        video.volume = v;
        video.muted = video.volume === 0;
        if(muteBtn) muteBtn.textContent = video.muted ? '🔇' : '🔊';
      }
    });
  }

  // Fullscreen button
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && typeof video.webkitEnterFullscreen === 'function') {
        // На iOS Safari используем встроенный fullscreen
        video.webkitEnterFullscreen();
        return;
      }
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.msRequestFullscreen) video.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
    });
  }

  // Когда входим / выходим из fullscreen (Android/PC)
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      video.controls = true;
      if (controlsRow) controlsRow.style.display = 'none';
    } else {
      video.controls = false;
      if (controlsRow) controlsRow.style.display = 'flex';
    }
  });

  // Для iOS Safari события
  video.addEventListener('webkitbeginfullscreen', () => {
    video.controls = true;
    if (controlsRow) controlsRow.style.display = 'none';
  });
  video.addEventListener('webkitendfullscreen', () => {
    video.controls = false;
    if (controlsRow) controlsRow.style.display = 'flex';
  });

  // Progress bar click (seek)
  if(progress){
    progress.addEventListener('click', (e)=>{
      if (!video.duration || isNaN(video.duration)) return;
      const rect = progress.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    });
  }

  // Update progress
  video.addEventListener('timeupdate', ()=>{
    if (!video.duration || isNaN(video.duration)) return;
    const percent = (video.currentTime / video.duration) * 100;
    if(progressFilled) progressFilled.style.width = percent + '%';
    let m = Math.floor(video.currentTime / 60);
    let s = Math.floor(video.currentTime % 60);
    if(s < 10) s = '0' + s;
    if(curTime) curTime.textContent = `${m}:${s}`;
  });

  // Show total duration
  video.addEventListener('loadedmetadata', ()=>{
    if (!video.duration || isNaN(video.duration)) return;
    let m = Math.floor(video.duration / 60);
    let s = Math.floor(video.duration % 60);
    if(s < 10) s = '0' + s;
    if(durTime) durTime.textContent = `${m}:${s}`;
  });

  // Sync mute icon
  video.addEventListener('volumechange', ()=>{
    if(muteBtn) muteBtn.textContent = (video.muted || video.volume === 0) ? '🔇' : '🔊';
    if(volume && typeof video.volume === 'number') volume.value = String(video.volume);
  });

});
