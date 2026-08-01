import { SKETCHES, byId, categoryLabel, type SketchEntry } from '../registry'
import { mountSketch, type SketchHandle } from '../runner'

const STAGE_SIZE = 640
const DEFAULT_SEED = 7

export function mountDetail(root: HTMLElement, id: string): { destroy: () => void } {
  const found = byId(id)
  if (!found) {
    root.innerHTML = `
      <main class="missing">
        <p class="mono">SKETCH ${id} NOT FOUND</p>
        <a class="head-link mono" href="#/">← BACK TO GALLERY</a>
      </main>
    `
    return { destroy: () => root.replaceChildren() }
  }

  const entry: SketchEntry = found
  const { meta } = entry
  const position = SKETCHES.findIndex((item) => item.meta.id === meta.id)
  const prev = SKETCHES[(position - 1 + SKETCHES.length) % SKETCHES.length]!
  const next = SKETCHES[(position + 1) % SKETCHES.length]!

  root.innerHTML = `
    <header class="site-head">
      <a class="brand" href="#/">DEXA GEN LAB<span class="dot">.</span></a>
      <a class="head-link mono" href="#/">← GALLERY</a>
      <a class="head-link mono" href="https://dexa.art">DEXA.ART ↗</a>
    </header>
    <main class="detail">
      <div class="detail-stage-wrap">
        <div class="stage detail-stage" data-role="stage"></div>
      </div>
      <section class="detail-info">
        <p class="eyebrow mono">${meta.id} · ${categoryLabel(meta.category)} · ${meta.engine.toUpperCase()}</p>
        <h1>${meta.title}</h1>
        <p class="detail-desc"></p>
        <div class="tag-row mono"></div>
        <div class="seed-row">
          <span class="seed mono">SEED <b data-role="seed"></b></span>
          <button type="button" class="btn-orange mono" data-role="regen">REGENERATE</button>
        </div>
        <div class="code-panel">
          <div class="code-head mono">
            <span>SOURCE · ${meta.id}_${meta.slug}.sketch.ts</span>
            <button type="button" class="btn-orange mono" data-role="copy">COPY</button>
          </div>
          <pre><code data-role="code">LOADING…</code></pre>
        </div>
        <nav class="detail-nav mono">
          <a href="#/s/${prev.meta.id}">← ${prev.meta.id} ${prev.meta.title}</a>
          <a href="#/s/${next.meta.id}">${next.meta.id} ${next.meta.title} →</a>
        </nav>
      </section>
    </main>
  `

  root.querySelector<HTMLElement>('.detail-desc')!.textContent = meta.description
  root.querySelector<HTMLElement>('.tag-row')!.replaceChildren(
    ...meta.tags.map((tag) => {
      const chip = document.createElement('span')
      chip.className = 'tag'
      chip.textContent = tag
      return chip
    }),
  )

  const stage = root.querySelector<HTMLElement>('[data-role="stage"]')!
  const seedEl = root.querySelector<HTMLElement>('[data-role="seed"]')!
  const codeEl = root.querySelector<HTMLElement>('[data-role="code"]')!
  const regen = root.querySelector<HTMLButtonElement>('[data-role="regen"]')!
  const copy = root.querySelector<HTMLButtonElement>('[data-role="copy"]')!

  let handle: SketchHandle | null = null
  let token = 0
  let disposed = false
  let seed = DEFAULT_SEED

  async function run() {
    const mine = ++token
    handle?.destroy()
    handle = null
    stage.replaceChildren()
    seedEl.textContent = String(seed)
    try {
      const mounted = await mountSketch(stage, entry, { seed, size: STAGE_SIZE })
      if (disposed || mine !== token) mounted.destroy()
      else handle = mounted
    } catch (error) {
      console.error(`detail: ${meta.id} failed to mount`, error)
    }
  }

  regen.addEventListener('click', () => {
    seed = Math.floor(Math.random() * 1_000_000)
    void run()
  })

  let source = ''
  void entry.source().then((text) => {
    if (disposed) return
    source = text
    codeEl.textContent = text
  })

  copy.addEventListener('click', () => {
    if (!source) return
    void navigator.clipboard.writeText(source).then(() => {
      copy.textContent = 'COPIED'
      window.setTimeout(() => {
        if (!disposed) copy.textContent = 'COPY'
      }, 1200)
    })
  })

  void run()

  return {
    destroy: () => {
      disposed = true
      token++
      handle?.destroy()
      root.replaceChildren()
    },
  }
}
