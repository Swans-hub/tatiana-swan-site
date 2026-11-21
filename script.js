// Карточки раздела «С чем можно обратиться».
// При выборе подсвечивается соответствующая PNG-линия.

document.querySelectorAll('.request-card').forEach(card => {
  card.addEventListener('click', () => {
    const willOpen = !card.classList.contains('is-open');

    document.querySelectorAll('.request-card').forEach(other => {
      other.classList.remove('is-open');
      other.setAttribute('aria-pressed', 'false');
    });

    if (willOpen) {
      card.classList.add('is-open');
      card.setAttribute('aria-pressed', 'true');
    }
  });
});


// Раскрывающиеся пункты раздела «Как я работаю».

document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(
      trigger.getAttribute('aria-controls')
    );

    if (!panel) return;

    const willOpen =
      trigger.getAttribute('aria-expanded') !== 'true';

    trigger.setAttribute('aria-expanded', String(willOpen));
    panel.hidden = !willOpen;

    const plus = trigger.querySelector('.accordion-plus');

    if (plus) {
      plus.textContent = willOpen ? '−' : '+';
    }
  });
});


// Раскрывающиеся подробности об образовании.

const educationTrigger = document.querySelector(
  '.education-more-trigger'
);

if (educationTrigger) {
  educationTrigger.addEventListener('click', () => {
    const panel = document.getElementById('education-panel');

    if (!panel) return;

    const willOpen =
      educationTrigger.getAttribute('aria-expanded') !== 'true';

    educationTrigger.setAttribute(
      'aria-expanded',
      String(willOpen)
    );

    panel.hidden = !willOpen;

    const icon = educationTrigger.querySelector(
      '.education-more-icon'
    );

    if (icon) {
      icon.textContent = willOpen ? '−' : '+';
    }
  });
}


// Выбор состояния в блоке записи.

const consultationTags = document.querySelectorAll(
  '.consultation-tag'
);

consultationTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const selected =
      tag.getAttribute('aria-pressed') === 'true';

    consultationTags.forEach(other => {
      other.setAttribute('aria-pressed', 'false');
    });

    if (!selected) {
      tag.setAttribute('aria-pressed', 'true');
    }
  });
});


// Подсветка активного пункта меню.

const navLinks = [
  ...document.querySelectorAll('.navigation a[href^="#"]')
];

const sectionIds = [
  'top',
  'requests',
  'methods',
  'education',
  'publications',
  'contacts'
];

const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

function updateActiveNavigation() {
  const position =
    window.scrollY + Math.min(180, window.innerHeight * .32);

  let current = 'top';

  for (const section of sections) {
    if (
      section.getBoundingClientRect().top +
      window.scrollY <= position
    ) {
      current = section.id;
    }
  }

  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 8
  ) {
    current = 'contacts';
  }

  if (current === 'requests') {
    current = 'top';
  }

  navLinks.forEach(link => {
    const active =
      link.getAttribute('href') === '#' + current;

    link.classList.toggle('is-active', active);

    if (active) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener(
  'scroll',
  updateActiveNavigation,
  { passive: true }
);

window.addEventListener('resize', updateActiveNavigation);

updateActiveNavigation();


// Анимация вазы кинцуги.
// Одно нажатие — один восстановленный участок.

const vaseScene = document.getElementById('kintsugi-vase');
const vaseButton = document.querySelector('.vase-prompt');
const vaseReset = document.querySelector('.vase-reset');

if (vaseScene && vaseButton) {
  const caption = vaseButton.querySelector('small');
  const label = caption?.parentElement;

  const shards = [
    ...vaseScene.querySelectorAll('.vase-shard')
  ];

  const goldPieces = [
    ...vaseScene.querySelectorAll('.vase-gold-piece')
  ];

  const goldSeams = [
    ...vaseScene.querySelectorAll('.vase-seam')
  ];

  const total = Math.min(shards.length, goldPieces.length);

  let step = 0;

  function renderVase() {
    shards.forEach((shard, index) => {
      shard.classList.toggle('is-healed', index < step);
    });

    goldPieces.forEach((piece, index) => {
      piece.classList.toggle('is-healed', index < step);
    });

    goldSeams.forEach((seam, index) => {
      seam.classList.toggle('is-healed', index < step);
    });

    const finished = step === total;
    vaseScene.classList.toggle('is-complete', finished);
    if (vaseReset) vaseReset.hidden = !finished;
    vaseScene.setAttribute('tabindex', finished ? '0' : '-1');
    vaseScene.setAttribute('role', finished ? 'link' : 'img');
    vaseScene.setAttribute('title', finished ? 'Читать статью о кинцуги' : '');

    vaseScene.setAttribute(
      'aria-label',
      finished
        ? 'Полностью восстановленная ваза кинцуги. Нажмите, чтобы прочитать статью'
        : `Восстановлено ${step} из ${total} частей вазы`
    );

    vaseButton.setAttribute(
      'aria-label',
      finished
        ? 'Ваза восстановлена. Нажмите на вазу, чтобы прочитать статью'
        : `Залить золотом следующий участок, ${step + 1} из ${total}`
    );

    if (label?.firstChild) {
      label.firstChild.textContent = finished
        ? 'Узнать больше'
        : 'Залить швы золотом';
    }

    if (caption) {
      caption.textContent = finished
        ? 'нажмите на вазу'
        : `${step} / ${total}`;
    }
  }

  vaseButton.addEventListener('click', () => {
    if (step === total) {
      vaseScene.focus();
      return;
    }
    step += 1;
    renderVase();
  });

  if (vaseReset) {
    vaseReset.addEventListener('click', () => {
      step = 0;
      renderVase();
      vaseButton.focus();
    });
  }

  if (total > 0) {
    renderVase();
  }

  // Собранная ваза открывает авторскую статью о кинцуги.
  // Пока ваза не собрана, нажатия на неё ничего не открывают.
  vaseScene.setAttribute('tabindex', '-1');
  vaseScene.addEventListener('click', () => {
    if (step === total && total > 0) {
      window.open('https://www.b17.ru/article/553225/', '_blank', 'noopener,noreferrer');
    }
  });
  vaseScene.addEventListener('keydown', event => {
    if (step === total && total > 0 && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      window.open('https://www.b17.ru/article/553225/', '_blank', 'noopener,noreferrer');
    }
  });
}


// Мобильное меню.

const menuToggle = document.querySelector(
  '.mobile-menu-toggle'
);

const mobileNavigation = document.querySelector(
  '#main-navigation'
);

if (menuToggle && mobileNavigation) {

  function setMobileMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));

    menuToggle.setAttribute(
      'aria-label',
      open ? 'Закрыть меню' : 'Открыть меню'
    );

    mobileNavigation.classList.toggle('is-open', open);
  }

  menuToggle.addEventListener('click', () => {
    setMobileMenu(
      menuToggle.getAttribute('aria-expanded') !== 'true'
    );
  });

  mobileNavigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMobileMenu(false);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMobileMenu(false);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.header-inner')) {
      setMobileMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      setMobileMenu(false);
    }
  });
}


// ПЛАВНАЯ НАВИГАЦИЯ ПО САЙТУ.
//
// Главная — начало сайта.
// Консультации — центр раздела.
// Все остальные — начало соответствующего раздела.

document.querySelectorAll(
  '.navigation a[href^="#"], ' +
  '.footer-nav a[href^="#"], ' +
  '.brand[href="#top"], ' +
  '.footer-up[href="#top"]'
).forEach(link => {

  link.addEventListener('click', event => {

    const hash = link.getAttribute('href');
    const target = document.getElementById(hash.slice(1));

    if (!target) return;

    event.preventDefault();

    const headerHeight =
      document.querySelector('.header')
        ?.getBoundingClientRect().height || 0;

    const rect = target.getBoundingClientRect();

    let y = 0;

    if (hash !== '#top') {

      // Обычные разделы — прокрутка к началу.

      y = window.scrollY + rect.top - headerHeight;

      // Только консультации — прокрутка к центру.

      if (hash === '#contacts') {
        y += (
          rect.height -
          Math.max(0, window.innerHeight - headerHeight)
        ) / 2;
      }
    }

    const maxY = Math.max(
      0,
      document.documentElement.scrollHeight -
      window.innerHeight
    );

    window.scrollTo({
      top: Math.max(0, Math.min(y, maxY)),
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches ? 'instant' : 'smooth'
    });

    history.replaceState(null, '', hash);
  });
});

// Article carousel: keep the original continuous loop, allow manual arrows.
(() => {
 const root=document.querySelector('.pub-flow-interactive');
 if(!root)return;
 const track=root.querySelector('.pub-flow-track');
 const first=track?.querySelector('.pub-flow-set');
 const prev=document.querySelector('.pub-arrow-prev');
 const next=document.querySelector('.pub-arrow-next');
 if(!track||!first||!prev||!next)return;
 let offset=0,last=0,paused=false,manualUntil=0;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const width=()=>first.getBoundingClientRect().width;
 const normalize=()=>{const w=width();if(w>0)offset=((offset%w)+w)%w;};
 const draw=()=>{track.style.transform=`translate3d(${-offset}px,0,0)`;};
 const step=(direction)=>{const card=first.querySelector('.pub-flow-card');const gap=parseFloat(getComputedStyle(first).gap)||24;const d=(card?.getBoundingClientRect().width||300)+gap;offset=(Math.round(offset/d)+direction)*d;normalize();draw();manualUntil=performance.now()+2200;};
 prev.addEventListener('click',()=>step(-1));
 next.addEventListener('click',()=>step(1));
 root.addEventListener('mouseenter',()=>paused=true);
 root.addEventListener('mouseleave',()=>paused=false);
 root.addEventListener('focusin',()=>paused=true);
 root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))paused=false;});
 const frame=(now)=>{if(!last)last=now;const dt=Math.min(now-last,80);last=now;if(!paused&&!reduced.matches&&now>manualUntil){offset+=dt*.022;normalize();draw();}requestAnimationFrame(frame);};
 requestAnimationFrame(frame);
 window.addEventListener('resize',()=>{normalize();draw();});
})();
