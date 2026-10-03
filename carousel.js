const workCards = document.querySelector('.projects');
if (workCards) {
  const viewport = document.createElement('div');
  viewport.className = 'work-viewport';
  workCards.before(viewport);
  viewport.append(workCards);
  const toggle = document.querySelector('#work-autoplay');
  let stopped = reduced.matches, moving = false, hovered = false;
  function sync() {
    toggle.textContent = stopped ? '播放輪播 ▷' : '暫停輪播 Ⅱ';
    toggle.setAttribute('aria-pressed', String(stopped));
  }
  toggle.addEventListener('click', () => { stopped = !stopped; sync(); });
  reduced.addEventListener('change', () => { stopped = reduced.matches; sync(); });
  viewport.addEventListener('pointerenter', () => { hovered = true; });
  viewport.addEventListener('pointerleave', () => { hovered = false; });
  async function next(manual = false) {
    if (moving || (!manual && (stopped || paused || hovered || document.hidden || viewport.contains(document.activeElement) || document.querySelector('dialog[open]')))) return;
    const rect = viewport.getBoundingClientRect();
    if (!manual && (rect.bottom < 0 || rect.top > innerHeight)) return;
    const first = workCards.firstElementChild;
    if (!first || workCards.children.length < 2) return;
    moving = true;
    // Temporary inert copy fills the trailing edge during the transition.
    const copy = first.cloneNode(true);
    copy.inert = true;
    copy.setAttribute('aria-hidden', 'true');
    const source = first.querySelector('canvas'), target = copy.querySelector('canvas');
    if (source && target) target.getContext('2d').drawImage(source, 0, 0);
    workCards.append(copy);
    const distance = first.getBoundingClientRect().width + parseFloat(getComputedStyle(workCards).columnGap);
    const animation = workCards.animate([{transform:'translateX(0)'},{transform:`translateX(-${distance}px)`}], {duration:reduced.matches ? 0 : 650,easing:'cubic-bezier(.22,.7,.3,1)',fill:'forwards'});
    try { await animation.finished; } finally {
      copy.remove(); workCards.append(first); animation.cancel(); moving = false;
    }
  }
  document.querySelector('#work-next').addEventListener('click', () => next(true));
  setInterval(() => next(), 5500);
  sync();
}
