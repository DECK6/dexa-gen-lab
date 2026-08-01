import { siteHeader } from './shell'

const COPY = {
  ko: {
    heroBody:
      '결정적 제너러티브 아트 200종을 브라우저에서 감상하고, 시드로 변주한 뒤, 실제 TypeScript 소스까지 가져가는 크리에이티브 코딩 카탈로그입니다.',
    sections: [
      {
        index: '01 / BROWSE',
        title: '갤러리 탐색',
        body: '20개 카테고리와 p5.js·Three.js 엔진으로 필터링하고 제목, ID, 태그를 검색합니다. 정지 썸네일은 가볍게 유지되고 포커스한 작품만 라이브로 실행됩니다.',
      },
      {
        index: '02 / REGENERATE',
        title: '시드로 변주',
        body: '상세 화면에서 새 시드를 생성해 같은 알고리즘의 다른 결과를 즉시 확인합니다. 같은 시드는 언제나 같은 초기 조건과 작품을 재현합니다.',
      },
      {
        index: '03 / READ',
        title: '알고리즘 읽기',
        body: '각 작품의 TypeScript 소스를 그대로 열어 보고 복사합니다. 메타데이터와 스케치 파일 한 쌍이 하나의 독립적인 작품 단위입니다.',
      },
      {
        index: '04 / EXTEND',
        title: '새 작품 추가',
        body: '카테고리 폴더에 파일 쌍을 드롭하면 갤러리가 자동으로 발견합니다. 레지스트리 린트가 결정성, 팔레트, 파일명, 메타 계약을 검사합니다.',
      },
    ],
    sourceLabel: '전체 소스, 200종 카탈로그, 설계 계약은 GitHub에 공개되어 있습니다.',
  },
  en: {
    heroBody:
      'A creative-coding catalog for exploring 200 deterministic generative artworks in the browser, regenerating them by seed, and taking the TypeScript source.',
    sections: [
      {
        index: '01 / BROWSE',
        title: 'Browse the gallery',
        body: 'Filter across 20 categories and the p5.js or Three.js engines, then search by title, ID, or tag. Thumbnails stay light; only focused works run live.',
      },
      {
        index: '02 / REGENERATE',
        title: 'Vary the seed',
        body: 'Generate a new seed on the detail page to see another result from the same algorithm. A repeated seed always restores the same initial conditions.',
      },
      {
        index: '03 / READ',
        title: 'Read the algorithm',
        body: 'Open and copy the TypeScript source for every work. One metadata and sketch file pair is one self-contained catalog entry.',
      },
      {
        index: '04 / EXTEND',
        title: 'Add a work',
        body: 'Drop a matching file pair into a category folder and the gallery discovers it automatically. Registry lint enforces determinism, palette, naming, and metadata contracts.',
      },
    ],
    sourceLabel: 'The full source, 200-work catalog, and architecture contract are public on GitHub.',
  },
} as const

export function mountAbout(root: HTMLElement): { destroy: () => void } {
  let lang: keyof typeof COPY = 'ko'

  function render() {
    const copy = COPY[lang]
    root.innerHTML = `
      ${siteHeader('about')}
      <main class="about-page">
        <header class="about-hero">
          <div class="about-hero-top">
            <p class="eyebrow mono">DEXA GEN LAB / FIELD GUIDE</p>
            <div class="lang-toggle mono" role="group" aria-label="Language">
              <button type="button" data-lang="ko" class="${lang === 'ko' ? 'active' : ''}">KO</button>
              <button type="button" data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</button>
            </div>
          </div>
          <h1>GENERATE LIVE.<br />TAKE THE SOURCE<span>.</span></h1>
          <p data-role="hero-body"></p>
        </header>
        <div class="about-grid" data-role="about-grid"></div>
        <aside class="about-note mono">
          <span>RUNTIME CONTRACT</span>
          640×640 SQUARE / SEEDED PRNG / P5 + THREE / 200 ANIMATED WORKS / FIXED-FRAME THUMBNAILS
        </aside>
        <aside class="about-note mono">
          <span>SOURCE</span>
          <a href="https://github.com/DECK6/dexa-gen-lab" target="_blank" rel="noopener noreferrer" class="about-repo-link">GITHUB.COM/DECK6/DEXA-GEN-LAB ↗</a>
          <b data-role="source-label"></b>
        </aside>
      </main>
    `

    root.querySelector<HTMLElement>('[data-role="hero-body"]')!.textContent = copy.heroBody
    root.querySelector<HTMLElement>('[data-role="source-label"]')!.textContent = copy.sourceLabel
    const grid = root.querySelector<HTMLElement>('[data-role="about-grid"]')!
    for (const section of copy.sections) {
      const item = document.createElement('section')
      item.innerHTML = '<span class="about-index mono"></span><h2></h2><p></p>'
      item.querySelector<HTMLElement>('.about-index')!.textContent = section.index
      item.querySelector<HTMLElement>('h2')!.textContent = section.title
      item.querySelector<HTMLElement>('p')!.textContent = section.body
      grid.appendChild(item)
    }

    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
      button.addEventListener('click', () => {
        const next = button.dataset.lang as keyof typeof COPY
        if (next === lang) return
        lang = next
        render()
      })
    }
  }

  render()
  return { destroy: () => root.replaceChildren() }
}
