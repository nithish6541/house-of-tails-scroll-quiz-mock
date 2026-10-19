'use strict';
const household = document.querySelector('#household');
const video = document.querySelector('#thank-you-video');
const play = document.querySelector('#play-video');
const status = document.querySelector('#video-status');
const tabs = [...document.querySelectorAll('[role=tab]')];
const profiles = {
  dog: { name: 'Buddy', breed: 'Golden Retriever', species: 'Dog', age: '4 years', weight: '28 kg' },
  cat: { name: 'Cleo', breed: 'Domestic Shorthair', species: 'Cat', age: '3 years', weight: '4 kg' },
};
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let panelAnimation;
function selectSpecies(species, animate = true) {
  video.pause(); // Never leave the previous message playing behind another pet.
  try { video.currentTime = 0; } catch (_) { /* Metadata may not be loaded yet. */ }
  play.hidden = false;
  status.textContent = '';
  const pet = profiles[species];
  const both = household.value === 'both';
  document.querySelector('.species-tabs').hidden = !both;
  const panel = document.querySelector('#video-panel');
  panel.setAttribute('role', both ? 'tabpanel' : 'region');
  panel.setAttribute('aria-labelledby', both ? `tab-${species}` : 'video-heading');
  for (const tab of tabs) {
    const selected = tab.dataset.species === species;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  text('intro-copy', both ? 'Buddy and Cleo’s profiles are complete. A little guidance for each of them.' : `${pet.name}’s profile is complete. Here’s what comes next.`);
  text('audience', `For ${pet.name}’s ${species} parent`);
  text('profile-heading', `Meet ${pet.name}.`);
  text('profile-subtitle', `${pet.breed} · ${pet.species}`);
  text('pet-age', pet.age);
  text('pet-weight', pet.weight);
  text('review-name', pet.name);
  text('review-species', pet.species);
  text('review-breed', pet.breed);
  document.getElementById('pet-art').src = `./${species}.png`;
  panelAnimation?.cancel();
  if (animate && !reduced()) panelAnimation = document.querySelector('.profile-card').animate(
    [{ transform: 'translateY(5px)', opacity: .7 }, { transform: 'none', opacity: 1 }],
    { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' },
  );
}
household.addEventListener('change', () => selectSpecies(household.value === 'cat' ? 'cat' : 'dog'));
for (const tab of tabs) {
  tab.addEventListener('click', () => selectSpecies(tab.dataset.species));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - tabs.indexOf(tab);
    selectSpecies(tabs[index].dataset.species);
    tabs[index].focus();
  });
}
play.addEventListener('click', async () => {
  play.hidden = true;
  video.focus({ preventScroll: true });
  status.textContent = 'Loading reference clip…';
  video.muted = false;
  try { await video.play(); } catch (_) {
    play.hidden = false;
    status.textContent = 'The clip could not start. Try Play again or use the video controls.';
  }
});
video.addEventListener('playing', () => { play.hidden = true; status.textContent = ''; });
video.addEventListener('waiting', () => { status.textContent = 'Loading reference clip…'; });
video.addEventListener('error', () => { play.hidden = false; status.textContent = 'The clip could not load. Your results remain available.'; });
document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });

// Animate the actual disclosure height, rather than fading an already-open box.
const review = document.querySelector('#answer-review');
const summary = review.querySelector('summary');
let disclosureAnimation;
let expanded = review.open;
summary.addEventListener('click', event => {
  event.preventDefault();
  const start = review.getBoundingClientRect().height;
  disclosureAnimation?.cancel();
  expanded = !expanded;
  if (reduced()) { review.open = expanded; review.style.height = ''; review.style.overflow = ''; return; }
  review.open = true;
  review.style.height = '';
  const end = expanded ? review.getBoundingClientRect().height : summary.getBoundingClientRect().height;
  review.style.overflow = 'hidden';
  const animation = review.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' });
  disclosureAnimation = animation;
  animation.onfinish = () => {
    if (disclosureAnimation !== animation) return;
    review.open = expanded;
    review.style.height = '';
    review.style.overflow = '';
    disclosureAnimation = null;
  };
});
selectSpecies('dog', false);
