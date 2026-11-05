const videos = [...document.querySelectorAll('video')];
// Keep the page quiet and avoid decoding several recordings at once.
for (const video of videos) {
  video.addEventListener('play', () => {
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
    document.querySelector('#sequence-count').textContent = selected === 'all'
      ? 'Showing all 9 sequences'
      : `Showing 3 ${selected} sequences`;
  });
}
