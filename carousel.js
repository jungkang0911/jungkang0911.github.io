const workCards = document.querySelector('.projects');
if (workCards) {
  const viewport = document.createElement('div');
  viewport.className = 'work-viewport';
  workCards.before(viewport);
  viewport.append(workCards);
  let moving = false, hovered = false, gesture = null, suppressClick = false;
  viewport.addEventListener('pointerenter', () => { hovered = true; });
  viewport.addEventListener('pointerleave', () => { hovered = false; });
  async function next(manual = false, direction = 1) {
    if (moving || (!manual && (reduced.matches || paused || hovered || gesture || document.hidden || viewport.contains(document.activeElement) || document.querySelector('dialog[open]')))) return;
    const rect = viewport.getBoundingClientRect();
    if (!manual && (rect.bottom < 0 || rect.top > innerHeight)) return;
    const first = direction > 0 ? workCards.firstElementChild : workCards.lastElementChild;
    if (!first || workCards.children.length < 2) return;
    moving = true;
    // Temporary inert copy fills the trailing edge during the transition.
    const copy = first.cloneNode(true);
    copy.inert = true;
    copy.setAttribute('aria-hidden', 'true');
    const source = first.querySelector('canvas'), target = copy.querySelector('canvas');
    if (source && target) target.getContext('2d').drawImage(source, 0, 0);
    if (direction > 0) workCards.append(copy); else workCards.prepend(copy);
    const distance = first.getBoundingClientRect().width + parseFloat(getComputedStyle(workCards).columnGap);
    const frames = [{transform:'translateX(0)'},{transform:`translateX(-${distance}px)`}];
    const animation = workCards.animate(direction > 0 ? frames : frames.reverse(), {duration:reduced.matches ? 0 : 450,easing:'cubic-bezier(.22,.7,.3,1)',fill:'forwards'});
    try { await animation.finished; } finally {
      copy.remove();
      if (direction > 0) workCards.append(first); else workCards.prepend(first);
      animation.cancel(); moving = false;
    }
  }
  document.querySelector('#work-next').addEventListener('click', () => next(true));
  viewport.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0 || moving) return;
    suppressClick = false;
    gesture = {id:e.pointerId,x:e.clientX,y:e.clientY,dragging:false};
  });
  viewport.addEventListener('pointermove', e => {
    if (!gesture || e.pointerId !== gesture.id) return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    if (!gesture.dragging && Math.abs(dy)>Math.abs(dx) && Math.abs(dy)>10) { gesture=null; return; }
    if (Math.abs(dx)>10 && !gesture.dragging) {
      gesture.dragging=true; suppressClick=true;
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
    }
  });
  function release(e) {
    if (!gesture || e.pointerId !== gesture.id) return;
    const drag=gesture; gesture=null;
    viewport.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    if (e.type==='pointerup' && drag.dragging && Math.abs(e.clientX-drag.x)>40) next(true,e.clientX<drag.x?1:-1);
  }
  viewport.addEventListener('pointerup',release);
  viewport.addEventListener('pointercancel',release);
  viewport.addEventListener('pointerleave',() => { if (gesture && !gesture.dragging) gesture=null; });
  viewport.addEventListener('click',e => { if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;} },true);
  viewport.addEventListener('keydown',e => { if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();next(true,e.key==='ArrowRight'?1:-1);} });
  setInterval(() => next(), 5500);
}
