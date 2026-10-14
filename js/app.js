import {
  clinic, hours, outOfHours, nav, serviceGroups, fees, freeCare, faqs,
} from './data.js';
import { icon, logoMark } from './icons.js';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const years = new Date().getFullYear() - clinic.founded;

const callBtn = (cls = 'btn--go', label = `Call ${clinic.phone}`) =>
  `<a class="btn ${cls}" href="${clinic.phoneHref}">${icon('phone')}<span>${label}</span></a>`;
const emailBtn = (cls = 'btn--line', label = 'Email the surgery') =>
  `<a class="btn ${cls}" href="mailto:${clinic.email}">${icon('mail')}<span>${label}</span></a>`;
const directionsBtn = (cls = 'btn--line') =>
  `<a class="btn ${cls}" href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('navigation')}<span>Get directions</span></a>`;

const rating = (cls = '') => `
  <a class="rating ${cls}" href="${clinic.mapsUrl}" target="_blank" rel="noopener" aria-label="Rated ${clinic.rating.score} out of 5 from ${clinic.rating.count} Google reviews">
    <b>${clinic.rating.score}</b><span class="rating__stars" aria-hidden="true">★★★★★<i style="width:${(Number(clinic.rating.score) / 5) * 100}%">★★★★★</i></span><span>${clinic.rating.count} Google reviews</span>
  </a>`;

// Section eyebrow styled as a line-stop sign.
const stop = (text) => `<p class="stop"><span class="stop__dot" aria-hidden="true"></span>${text}</p>`;

const pageHead = ({ crumb, title, lead, actions = '' }) => `
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">›</span><span aria-current="page">${crumb}</span></nav>
      <h1 class="title-xl">${title}</h1>
      ${lead ? `<p class="intro">${lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
  </section>`;

const accordion = (items) => `
  <div class="faq">
    ${items.map((it) => `
      <details class="faq__item" name="faq">
        <summary><span>${it.q}</span><span class="faq__icon" aria-hidden="true"></span></summary>
        <div class="faq__body"><p>${it.a}</p></div>
      </details>`).join('')}
  </div>`;

/* ---------- opening hours ---------- */
function dublinNow() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Dublin' }));
  return { day: now.getDay(), mins: now.getHours() * 60 + now.getMinutes() };
}

function openStatus() {
  const { day, mins } = dublinNow();
  const today = hours.find((h) => h.day === day);
  const now = today.sessions.find((s) => mins >= s.open && mins < s.close);
  if (now) return { open: true, text: `Open now · until ${now.text.split('–')[1].trim()}` };
  // Next session: later today, or the next day with sessions.
  for (let i = 0; i < 8; i++) {
    const h = hours.find((x) => x.day === (day + i) % 7);
    const next = h.sessions.find((s) => i > 0 || s.open > mins);
    if (!next) continue;
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : h.label;
    return { open: false, text: `Closed · opens ${when} at ${next.text.split('–')[0].trim()}` };
  }
  return { open: false, text: 'Closed' };
}

const statusPill = (s = openStatus(), cls = '') => `<span class="pill ${s.open ? 'is-open' : ''} ${cls}"><span class="dot"></span>${s.text}</span>`;

// "Today's line": the day as stops on a route — surgery sessions, then out-of-hours cover.
function todayLine() {
  const { day, mins } = dublinNow();
  const today = hours.find((h) => h.day === day);
  const weekend = day === 0 || day === 6;
  const stops = today.sessions.map((s) => ({ ...s, kind: 'surgery', sub: 'By appointment' }));
  if (weekend) {
    stops.push({ name: 'Luke Doc', text: '10am – 6pm', open: 600, close: 1080, kind: 'ooh', sub: `Out of hours · ${outOfHours[0].phone}` });
  } else {
    stops.push({ name: 'Luke Doc', text: '6.30pm – 10pm', open: 1110, close: 1320, kind: 'ooh', sub: `Out of hours · ${outOfHours[0].phone}` });
  }
  stops.push({ name: 'GP 24', text: '24 hours', open: 0, close: 1440, kind: 'ooh', sub: `Essential calls only · ${outOfHours[1].phone}` });
  const current = stops.findIndex((s) => s.kind === 'surgery' && mins >= s.open && mins < s.close);
  return `
  <div class="line-card">
    <div class="line-card__head">
      <span class="line-card__k">${today.label} at the surgery</span>
      ${statusPill(openStatus(), 'pill--dark')}
    </div>
    ${weekend ? `<p class="line-card__note">${icon('info')}No surgery today${day === 6 ? ' (Saturday surgery is suspended)' : ''}. Out-of-hours cover for registered patients:</p>` : ''}
    <ol class="line">
      ${stops.map((s, i) => `
        <li class="line__stop line__stop--${s.kind}${i === current ? ' is-now' : ''}">
          <span class="line__dot" aria-hidden="true"></span>
          <span class="line__time">${s.text}</span>
          <span class="line__name">${s.name}${i === current ? ' <em>Now</em>' : ''}</span>
          <span class="line__sub">${s.sub}</span>
        </li>`).join('')}
    </ol>
    <a class="line-card__link" href="#/hours">Full opening times ${icon('arrowRight')}</a>
  </div>`;
}

function weekTable() {
  const { day } = dublinNow();
  return `
  <div class="week" role="table" aria-label="Weekly opening times">
    <div class="week__row week__row--head" role="row">
      <span role="columnheader">Day</span><span role="columnheader">Morning</span><span role="columnheader">Evening</span>
    </div>
    ${[1, 2, 3, 4, 5, 6, 0].map((d) => {
      const h = hours.find((x) => x.day === d);
      const cells = h.sessions.length
        ? h.sessions.map((s) => `<span role="cell">${s.text}</span>`).join('')
        : `<span role="cell" class="week__closed">${h.note}</span>`;
      return `<div class="week__row${d === day ? ' is-today' : ''}" role="row"><span role="rowheader">${h.label}${d === day ? ' <em>Today</em>' : ''}</span>${cells}</div>`;
    }).join('')}
  </div>`;
}

/* ---------- shared blocks ---------- */
const luasSign = () => `
  <div class="luas" aria-hidden="true">
    <span class="luas__line">Green Line</span>
    <span class="luas__name">Beechwood</span>
    <span class="luas__sub">Ranelagh Surgery is next to this stop</span>
  </div>`;

function visitBlock() {
  return `
  <section class="block block--mint" id="visit">
    <div class="wrap visit">
      <div data-reveal>
        ${stop('Find us')}
        <h2 class="title-lg">Next to Beechwood Luas.</h2>
        ${luasSign()}
        <dl class="facts">
          <div><dt>${icon('mapPin')}Address</dt><dd>${clinic.addressText}<button type="button" class="link" data-copy="${esc(clinic.addressText)}">${icon('copy')}Copy address</button></dd></div>
          <div><dt>${icon('train')}By Luas</dt><dd>Green Line to Beechwood. The surgery is next to the stop.</dd></div>
          <div><dt>${icon('phone')}Phone</dt><dd><a href="${clinic.phoneHref}">${clinic.phone}</a></dd></div>
          <div><dt>${icon('mail')}Email</dt><dd><a href="mailto:${clinic.email}">${clinic.email}</a></dd></div>
        </dl>
        <div class="actions">${directionsBtn('btn--go')}${callBtn('btn--line')}</div>
      </div>
      <div class="map" data-reveal>
        <iframe title="Map showing ${clinic.name}" loading="lazy" src="${clinic.mapEmbed}" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </section>`;
}

function outOfHoursBlock(withHead = true) {
  return `
  <section class="block block--night" id="out-of-hours">
    <div class="wrap">
      ${withHead ? `<div class="block__head" data-reveal>
        ${stop('When we’re closed')}
        <h2 class="title-lg">Out-of-hours care for registered patients.</h2>
      </div>` : ''}
      <div class="ooh">
        ${outOfHours.map((o) => `
          <article class="ooh__card" data-reveal>
            <h3 class="title-md">${icon('moon')}${o.name}</h3>
            <ul>${o.when.map((w) => `<li>${w}</li>`).join('')}</ul>
            ${o.where ? `<p class="ooh__where">${icon('mapPin')}${o.where}</p>` : ''}
            <p class="ooh__fee">${o.fee}</p>
            <a class="btn btn--sun" href="${o.phoneHref}">${icon('phone')}<span>Call ${o.name} · ${o.phone}</span></a>
          </article>`).join('')}
      </div>
      <p class="ooh__999" data-reveal>${icon('alert')}In an emergency, call 999 or 112.</p>
    </div>
  </section>`;
}

function callout(title = 'To book, just call.', text = 'Appointments are made by phone during surgery hours.') {
  return `
  <section class="callout">
    <div class="wrap callout__inner" data-reveal>
      <div>
        <h2 class="title-lg">${title}</h2>
        <p>${text}</p>
      </div>
      <div class="actions">${callBtn('btn--sun btn--big')}</div>
    </div>
  </section>`;
}

const feeBoard = (items = fees) => `
  <div class="board" role="table" aria-label="Fees">
    ${items.map((f) => `
      <div class="board__row" role="row">
        <span class="board__name" role="cell">${f.name}${f.note ? `<small>${f.note}</small>` : ''}</span>
        <span class="board__price" role="cell">${f.price}</span>
      </div>`).join('')}
  </div>`;

const freeList = () => `
  <ul class="free">
    ${freeCare.map((f) => `<li data-reveal>${icon('check')}<span><strong>${f.title}</strong>${f.text}</span></li>`).join('')}
  </ul>`;

/* ---------- pages ---------- */
function renderHome() {
  return `
  <section class="hero">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        ${stop(`Ranelagh · Dublin 6 · since ${clinic.founded}`)}
        <h1 class="title-hero">Your GP on <span>Dunville Avenue.</span></h1>
        <p class="hero__lead">${clinic.doctor} has looked after patients in Ranelagh since ${clinic.founded}. Morning and evening surgery, Monday to Friday, right next to Beechwood Luas.</p>
        <div class="actions">${callBtn('btn--go btn--big')}<a class="btn btn--line btn--big" href="#/contact" data-scroll="book">${icon('calendar')}<span>How to book</span></a></div>
        ${rating()}
      </div>
      ${todayLine()}
    </div>
  </section>

  <section class="signs" aria-label="At a glance">
    <div class="wrap signs__row">
      <div class="sign"><b>${clinic.founded}</b><span>Caring for Ranelagh for ${years} years</span></div>
      <div class="sign"><b>2</b><span>Surgery sessions a day, until 6.30pm</span></div>
      <div class="sign"><b>€55</b><span>GP visit. Medical cards accepted</span></div>
      <div class="sign sign--green"><b>${icon('train')}</b><span>Next to Beechwood Luas, Green Line</span></div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="block__head" data-reveal>
        ${stop('Services')}
        <h2 class="title-lg">Everyday GP care, under one roof.</h2>
        <a class="link" href="#/services">All services ${icon('arrowRight')}</a>
      </div>
      <div class="groups">
        ${serviceGroups.map((g) => `
          <a class="group" href="#/services/${g.id}" data-reveal>
            <span class="group__icon">${icon(g.icon)}</span>
            <h3 class="title-sm">${g.title}</h3>
            <ul>${g.items.slice(0, 3).map((it) => `<li>${it}</li>`).join('')}</ul>
            <span class="group__go">${icon('arrowRight')}</span>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="block block--mint">
    <div class="wrap duo">
      <div data-reveal>
        ${stop('Fees')}
        <h2 class="title-lg">Clear fees, before you visit.</h2>
        <p class="intro">All major credit and debit cards accepted. Medical card and GP visit card holders are seen free.</p>
        <a class="btn btn--dark" href="#/fees">All fees ${icon('arrowRight')}</a>
      </div>
      <div data-reveal>${feeBoard(fees.slice(0, 4))}</div>
    </div>
  </section>

  ${outOfHoursBlock()}
  ${visitBlock()}
  ${callout()}`;
}

function renderAbout() {
  return `
  ${pageHead({
    crumb: 'About',
    title: `A local GP practice since ${clinic.founded}.`,
    lead: `Ranelagh Surgery was founded in ${clinic.founded}. ${clinic.doctor} sees patients at 32 Dunville Avenue, next to Beechwood Luas.`,
    actions: callBtn() + emailBtn(),
  })}
  <section class="block block--tight">
    <div class="wrap doctor">
      <div class="doctor__photo" data-reveal role="img" aria-label="Space for a photo of Dr Nikrow">${icon('user')}<span>Photo of Dr Nikrow</span></div>
      <div data-reveal>
        ${stop('Your doctor')}
        <h2 class="title-lg">${clinic.doctor}</h2>
        <p class="intro">Graduate of the Royal College of Surgeons in Ireland, Dublin (1993). Member of the Irish College of General Practitioners.</p>
        <ul class="quals" aria-label="Qualifications">
          ${['MB', 'BCh', 'NUI', 'LRCP & LRCSI', 'MICGP'].map((q) => `<li>${q}</li>`).join('')}
        </ul>
        <div class="actions"><a class="btn btn--dark" href="#/services">Our services ${icon('arrowRight')}</a><a class="btn btn--line" href="#/hours">Opening times</a></div>
      </div>
    </div>
  </section>
  <section class="block block--mint">
    <div class="wrap duo">
      <div data-reveal>
        ${stop('Who we see')}
        <h2 class="title-lg">Private and medical card patients.</h2>
        <p class="intro">GMS medical cards and free GP visit cards are accepted, and some care is free for everyone.</p>
        <a class="btn btn--dark" href="#/fees">See our fees ${icon('arrowRight')}</a>
      </div>
      <div>${freeList()}</div>
    </div>
  </section>
  <section class="block block--tight">
    <div class="wrap">
      <div class="photo-slot" data-reveal role="img" aria-label="Space for a photo of the surgery">${icon('home')}<span>Photo of the surgery and waiting room</span></div>
    </div>
  </section>
  ${callout('See Dr Nikrow.', `Call ${clinic.phone} to make an appointment.`)}`;
}

function renderServices(sub) {
  return `
  ${pageHead({
    crumb: 'Services',
    title: 'Our services.',
    lead: 'A wide range of GP services, including assessment, diagnosis, management and treatment of medical conditions.',
  })}
  <section class="block block--tight">
    <div class="wrap services">
      <nav class="index" aria-label="Service groups">
        ${serviceGroups.map((g) => `<a href="#/services/${g.id}">${icon(g.icon)}${g.title}</a>`).join('')}
      </nav>
      <div class="services__list">
        ${serviceGroups.map((g) => `
          <article class="service${sub === g.id ? ' is-target' : ''}" id="t-${g.id}" data-reveal>
            <span class="group__icon">${icon(g.icon)}</span>
            <div>
              <h2 class="title-md">${g.title}</h2>
              <p>${g.text}</p>
              <ul class="ticks">${g.items.map((it) => `<li>${icon('check')}${it}</li>`).join('')}</ul>
              ${g.notice ? `<p class="notice">${icon('info')}${g.notice}</p>` : ''}
            </div>
          </article>`).join('')}
      </div>
    </div>
  </section>
  <section class="block block--mint">
    <div class="wrap duo">
      <div data-reveal>
        ${stop('Free care')}
        <h2 class="title-lg">What’s free.</h2>
        <p class="intro">Some care costs nothing, depending on your card or circumstances.</p>
      </div>
      <div>${freeList()}</div>
    </div>
  </section>
  ${callout('Not sure if we can help?', `Call the surgery on ${clinic.phone} and ask.`)}`;
}

function renderHours() {
  return `
  ${pageHead({
    crumb: 'Opening times',
    title: 'Opening times.',
    lead: 'Monday to Friday, two surgery sessions a day, by appointment. Appointments out of normal hours can at times be given if needed.',
    actions: callBtn() + statusPill(),
  })}
  <section class="block block--tight">
    <div class="wrap duo duo--top">
      <div data-reveal>${weekTable()}</div>
      <div data-reveal>${todayLine()}</div>
    </div>
  </section>
  ${outOfHoursBlock()}
  ${callout()}`;
}

function renderFees() {
  return `
  ${pageHead({
    crumb: 'Fees',
    title: 'Fees.',
    lead: 'Our fees for private patients. All major credit and debit cards accepted.',
    actions: `<span class="pill pill--card">${icon('card')}Cards accepted</span>`,
  })}
  <section class="block block--tight">
    <div class="wrap duo duo--top">
      <div data-reveal>${feeBoard()}</div>
      <div data-reveal>
        <h2 class="title-md">Free care</h2>
        ${freeList()}
        <p class="fine">${icon('info')}Prices are a guide and may change. Please confirm the cost when you book.</p>
      </div>
    </div>
  </section>
  <section class="block block--mint">
    <div class="wrap">
      <div class="block__head" data-reveal>
        ${stop('Out of hours')}
        <h2 class="title-lg">Out-of-hours fees.</h2>
      </div>
      ${feeBoard(outOfHours.map((o) => ({ name: o.name, price: o.price, note: o.free })))}
    </div>
  </section>
  ${callout('Questions about a fee?', `Call the surgery on ${clinic.phone}.`)}`;
}

function renderContact() {
  return `
  ${pageHead({
    crumb: 'Contact',
    title: 'Contact the surgery.',
    lead: `${clinic.addressText}. Next to Beechwood Luas.`,
    actions: callBtn() + emailBtn(),
  })}
  <section class="block block--tight">
    <div class="wrap contact">
      <div class="book" id="book" data-reveal>
        ${stop('Appointments')}
        <h2 class="title-lg">Book by phone.</h2>
        <p class="intro">To make an appointment, please call the surgery. Appointments are not made by email.</p>
        <a class="book__phone" href="${clinic.phoneHref}">${icon('phone')}<span><small>Call</small>${clinic.phone}</span></a>
        <p class="muted">Monday to Friday, 10am – 1.30pm and 4pm – 6.30pm. ${statusPill()}</p>
      </div>
      <aside class="contact__side">
        <a class="card" href="mailto:${clinic.email}" data-reveal>
          <span class="card__k">${icon('mail')}Email</span>
          <span class="card__v">${clinic.email}</span>
          <span class="muted">For general queries, not appointments</span>
        </a>
        <div class="card" data-reveal>
          <span class="card__k">${icon('printer')}Fax</span>
          <span class="card__v">${clinic.fax}</span>
        </div>
        <a class="card card--night" href="#/hours" data-scroll="out-of-hours" data-reveal>
          <span class="card__k">${icon('moon')}Surgery closed?</span>
          <span class="card__v">Luke Doc · GP 24</span>
          <span>Out-of-hours care for registered patients</span>
        </a>
      </aside>
    </div>
  </section>
  <section class="block block--tight">
    <div class="wrap">
      <div class="message" id="message" data-reveal>
        <div>
          ${stop('Send a message')}
          <h2 class="title-md">A general question?</h2>
          <p class="muted">Write it here and we’ll open an email to the surgery, ready to send from your email app. Please don’t use this for appointments or anything urgent: call ${clinic.phone}.</p>
        </div>
        <form class="form" id="msg-form" novalidate>
          <div class="form__row">
            <label>Name<input name="name" required autocomplete="name"></label>
            <label>Phone<input name="phone" type="tel" required autocomplete="tel"></label>
          </div>
          <label>Topic
            <select name="topic">
              <option>General question</option><option>Fees</option><option>Medical card / GP visit card</option><option>Something else</option>
            </select>
          </label>
          <label>Message<textarea name="message" rows="4" required></textarea></label>
          <p class="form__error" id="form-error" role="alert" hidden>Please add your name, a phone number and your message.</p>
          <div class="form__actions"><button class="btn btn--dark" type="submit">${icon('send')}<span>Open email draft</span></button><button class="link" type="button" id="copy-msg">${icon('copy')}Copy message</button></div>
          <p class="form__feedback" id="msg-feedback" role="status" hidden></p>
        </form>
      </div>
    </div>
  </section>
  ${visitBlock()}
  <section class="block">
    <div class="wrap faq-wrap">
      <div data-reveal>
        ${stop('Questions')}
        <h2 class="title-lg">Good to know.</h2>
      </div>
      ${accordion(faqs)}
    </div>
  </section>`;
}

function renderNotFound() {
  return pageHead({
    crumb: 'Page not found', title: 'Wrong stop.',
    lead: 'We couldn’t find that page. It may have moved. Try one of the links above, or call the surgery.',
    actions: `<a class="btn btn--dark" href="#/">Back to home</a>${callBtn('btn--line')}`,
  });
}

const routes = {
  '': { title: 'GP in Ranelagh, Dublin 6', render: renderHome },
  about: { title: 'About', render: renderAbout },
  services: { title: 'Services', render: renderServices },
  hours: { title: 'Opening times', render: renderHours },
  fees: { title: 'Fees', render: renderFees },
  contact: { title: 'Contact', render: renderContact },
};

/* ---------- layout ---------- */
const logo = `<a class="logo" href="#/" aria-label="${clinic.name}, home">${logoMark}<span class="logo__text">Ranelagh Surgery<span>GP · Dunville Avenue</span></span></a>`;

function renderHeader(path) {
  $('#site-header').innerHTML = `
    <div class="wrap header">
      ${logo}
      <nav class="nav" id="nav" aria-label="Main">
        ${nav.map((n) => `<a href="#/${n.path}" ${n.path === path ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
        <a class="btn btn--go nav__cta" href="${clinic.phoneHref}">${icon('phone')}<span>${clinic.phone}</span></a>
      </nav>
      <a class="btn btn--go header__call" href="${clinic.phoneHref}">${icon('phone')}<span>${clinic.phone}</span></a>
      <button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Open menu">${icon('menu')}<span>Menu</span></button>
    </div>`;
  $('#menu-btn').addEventListener('click', () => toggleMenu());
}

function toggleMenu(force) {
  const btn = $('#menu-btn');
  const open = force ?? btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  btn.innerHTML = `${icon(open ? 'x' : 'menu')}<span>${open ? 'Close' : 'Menu'}</span>`;
  $('#nav').classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  ['#main', '#site-footer', '#action-bar'].forEach((selector) => {
    $(selector).inert = open;
  });
  if (open) $('#nav a').focus();
}

function renderFooter() {
  $('#site-footer').innerHTML = `
    <div class="wrap footer">
      <div class="footer__brand">
        ${logo}
        <p>${clinic.addressText}</p>
        <p><a href="${clinic.phoneHref}">${clinic.phone}</a><br><a href="mailto:${clinic.email}">${clinic.email}</a></p>
      </div>
      <div>
        <h2 class="footer__title">Pages</h2>
        <ul>${nav.map((n) => `<li><a href="#/${n.path}">${n.label}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="footer__title">Surgery hours</h2>
        <ul class="footer__hours">
          <li>Mon – Fri, morning<span>10am – 1.30pm</span></li>
          <li>Mon – Fri, evening<span>4pm – 6.30pm</span></li>
          <li>Sat &amp; Sun<span>Closed</span></li>
          <li>Out of hours<span><a href="${outOfHours[0].phoneHref}">Luke Doc</a> · <a href="${outOfHours[1].phoneHref}">GP 24</a></span></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer__base">
      <span>© ${new Date().getFullYear()} ${clinic.name}</span>
      <span>Design concept for discussion. Not the official website: visit <a href="${clinic.officialSite}">${clinic.officialSite.replace('https://', '')}</a>.</span>
    </div>`;
  $('#action-bar').innerHTML = `
    <a href="${clinic.phoneHref}">${icon('phone')}<span>Call</span></a>
    <a href="#/contact" data-scroll="book">${icon('calendar')}<span>Book</span></a>
    <a href="${clinic.directionsUrl}" target="_blank" rel="noopener">${icon('navigation')}<span>Directions</span></a>`;
}

/* ---------- interactions ---------- */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('is-visible'), 2400);
}

function bindPage() {
  // Copy address
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast('Address copied'); } catch { toast(b.dataset.copy); }
  }));

  // General message → opens the patient's email app with a ready-to-send message.
  const form = $('#msg-form');
  if (form) {
    const prepare = () => {
      const f = new FormData(form);
      const name = (f.get('name') || '').trim();
      const phone = (f.get('phone') || '').trim();
      const message = (f.get('message') || '').trim();
      const ok = Boolean(name && phone && message);
      $('#form-error').hidden = ok;
      if (!ok) {
        form.elements.namedItem(!name ? 'name' : !phone ? 'phone' : 'message').focus();
        return null;
      }
      const body = [`Name: ${name}`, `Phone: ${phone}`, `Topic: ${f.get('topic')}`, '', message].join('\n');
      return { body, subject: `${f.get('topic')}: ${name}` };
    };
    const feedback = (msg) => {
      $('#msg-feedback').textContent = msg;
      $('#msg-feedback').hidden = false;
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const m = prepare();
      if (!m) return;
      feedback('Opening your email app. Send the draft there. If no app opens, use Copy message and paste it into an email.');
      window.location.href = `mailto:${clinic.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    });
    $('#copy-msg').addEventListener('click', async () => {
      const m = prepare();
      if (!m) return;
      try {
        await navigator.clipboard.writeText(`To: ${clinic.email}\nSubject: ${m.subject}\n\n${m.body}`);
        feedback(`Message copied. Paste it into an email to ${clinic.email}.`);
      } catch {
        feedback(`Copy is unavailable in this browser. Use Open email draft or call ${clinic.phone}.`);
      }
    });
  }
}

function reveal() {
  const els = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/* ---------- router ---------- */
let pendingScroll = null;
document.addEventListener('click', (e) => {
  if (e.target.closest('.skip-link')) {
    e.preventDefault();
    $('#main').focus();
    $('#main').scrollIntoView({ block: 'start' });
    return;
  }
  const a = e.target.closest('[data-scroll]');
  if (a) {
    // Already on that page: no hashchange will fire, so scroll straight to the section.
    if (a.getAttribute('href') === location.hash) {
      e.preventDefault();
      $(`#${a.dataset.scroll}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } else {
      pendingScroll = a.dataset.scroll;
    }
  }
  if (e.target.closest('#nav a')) toggleMenu(false);
});

function route() {
  const [path = '', sub] = location.hash.replace(/^#\/?/, '').split('/');
  const r = routes[path];
  const main = $('#main');
  main.innerHTML = r ? r.render(sub) : renderNotFound();
  document.title = `${r ? r.title : 'Page not found'} | ${clinic.name}`;
  renderHeader(path);
  toggleMenu(false);
  bindPage();
  reveal();

  const target = sub ? $(`#t-${sub}`) : pendingScroll ? $(`#${pendingScroll}`) : null;
  pendingScroll = null;
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
  } else {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
}

renderFooter();
window.addEventListener('hashchange', route);
window.addEventListener('keydown', (e) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (e.key === 'Escape') { toggleMenu(false); $('#menu-btn').focus(); }
  if (e.key === 'Tab') {
    const controls = $$('.site-header a, .site-header button');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 960 && document.body.classList.contains('menu-open')) toggleMenu(false);
});
route();
