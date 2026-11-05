const videos = [...document.querySelectorAll('video')];
// Keep the page quiet and avoid decoding several recordings at once.
for (const video of videos) {
  // Values in HTML are seconds to skip from the beginning and end.
  const range = () => {
    if (!Number.isFinite(video.duration)) return null;
    const start = Math.max(0, Number(video.dataset.trimStart) || 0);
    const end = video.duration - Math.max(0, Number(video.dataset.trimEnd) || 0);
    return start < end ? { start, end } : null;
  };
  let adjustingRange = false;
  const seekTo = time => {
    adjustingRange = true;
    video.currentTime = time;
  };
  if (video.hasAttribute('data-trim-start') || video.hasAttribute('data-trim-end')) {
    video.addEventListener('loadeddata', () => {
      const bounds = range();
      if (bounds) seekTo(bounds.start);
    });
    video.addEventListener('seeked', () => {
      if (adjustingRange) { adjustingRange = false; return; }
      const bounds = range();
      if (!bounds) return;
      if (video.currentTime < bounds.start) seekTo(bounds.start);
      if (video.currentTime > bounds.end) seekTo(bounds.end);
    });
    video.addEventListener('timeupdate', () => {
      const bounds = range();
      if (bounds && video.currentTime >= bounds.end) {
        video.pause();
        if (video.currentTime !== bounds.end) seekTo(bounds.end);
      }
    });
  }
  video.addEventListener('play', () => {
    const bounds = range();
    if (bounds && (video.currentTime < bounds.start || video.currentTime >= bounds.end)) {
      seekTo(bounds.start);
    }
    for (const other of videos) if (other !== video) other.pause();
  });
}
const filters = [...document.querySelectorAll('[data-filter]')];
for (const button of filters) {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    for (const filter of filters) {
      filter.setAttribute('aria-pressed', String(filter === button));
    }
    for (const group of document.querySelectorAll('[data-environment]')) {
      group.hidden = selected !== 'all' && group.dataset.environment !== selected;
      if (group.hidden) for (const video of group.querySelectorAll('video')) video.pause();
    }
    const count = document.querySelector('#sequence-count');
    if (count) count.textContent = selected === 'all'
      ? 'Showing all 9 sequences'
      : `Showing 3 ${selected} sequences`;
  });
}
