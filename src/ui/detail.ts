import { SKETCHES, byId, categoryLabel, type SketchEntry } from '../registry'
import { mountSketch, type SketchHandle } from '../runner'
import { siteHeader } from './shell'

const STAGE_SIZE = 640
const DEFAULT_SEED = 7

export function mountDetail(root: HTMLElement, id: string): { destroy: () => void } {
  const found = byId(id)
  if (!found) {
    root.innerHTML = `
      ${siteHeader('detail')}
      <main class="not-found">
        <p class="mono">SKETCH ${id} NOT FOUND</p>
        <a class="action-button mono" href="#/">BACK TO GALLERY</a>
      </main>
    `
    return { destroy: () => root.replaceChildren() }
  }

  const entry: SketchEntry = found
  const { meta } = entry
  const position = SKETCHES.findIndex((item) => item.meta.id === meta.id)
  const prev = SKETCHES[(position - 1 + SKETCHES.length) % SKETCHES.length]!
  const next = SKETCHES[(position + 1) % SKETCHES.length]!
  const related = SKETCHES.filter(
    (item) => item.meta.category === meta.category && item.meta.id !== meta.id,
  ).slice(0, 3)

  root.innerHTML = `
    ${siteHeader('detail')}
    <main class="detail-page">
      <div class="detail-title-row">
        <div>
          <p class="eyebrow mono">${meta.id} / ${categoryLabel(meta.category)} / ${meta.engine.toUpperCase()}</p>
          <h1>${meta.title}<span>.</span></h1>
        </div>
        <a class="text-link mono" href="#/">← BACK TO GALLERY</a>
      </div>

      <section class="detail-workbench">
        <div class="detail-preview-panel">
          <div class="preview-bezel detail-bezel">
            <div class="stage detail-stage" data-role="stage"></div>
          </div>
        </div>
        <aside class="param-panel">
          <div class="panel-heading mono"><span>SKETCH CONTROL</span><span>${meta.id}</span></div>
          <div class="param-list">
            <div class="param-control mono"><span>SEED</span><output data-role="seed"></output></div>
            <button type="button" class="action-button mono regen-button" data-role="regen">REGENERATE</button>
            <p class="detail-description" data-role="description"></p>
            <div class="tag-row mono" data-role="tags"></div>
          </div>
          <nav class="detail-nav mono">
            <a href="#/s/${prev.meta.id}">← ${prev.meta.id}</a>
            <a href="#/s/${next.meta.id}">${next.meta.id} →</a>
          </nav>
        </aside>
      </section>

      <section class="code-panel">
        <div class="section-heading">
          <div><p class="eyebrow mono">READ THE ALGORITHM</p><h2>SOURCE CODE</h2></div>
        </div>
        <div class="code-console">
          <div class="code-tabs mono">
            <button type="button" class="is-active">SKETCH.TS</button>
            <span>${meta.id}_${meta.slug}.sketch.ts</span>
            <button type="button" class="copy-button" data-role="copy">COPY</button>
          </div>
          <pre><code data-role="code">LOADING…</code></pre>
        </div>
      </section>

      <section class="related-section">
        <div class="section-heading">
          <div><p class="eyebrow mono">SAME CATEGORY</p><h2>RELATED WORKS</h2></div>
        </div>
        <div class="related-grid" data-role="related"></div>
      </section>
    </main>
  `

  root.querySelector<HTMLElement>('[data-role="description"]')!.textContent = meta.description
  root.querySelector<HTMLElement>('[data-role="tags"]')!.replaceChildren(
    ...meta.tags.map((tag) => {
      const chip = document.createElement('span')
      chip.className = 'tag'
      chip.textContent = tag
      return chip
    }),
  )
  const relatedGrid = root.querySelector<HTMLElement>('[data-role="related"]')!
  for (const item of related) {
    const card = document.createElement('a')
    card.className = 'related-card mono'
    card.href = `#/s/${item.meta.id}`
    const number = document.createElement('span')
    number.textContent = item.meta.id
    const title = document.createElement('strong')
    title.textContent = item.meta.title
    const detail = document.createElement('small')
    detail.textContent = `${categoryLabel(item.meta.category)} / ${item.meta.engine.toUpperCase()}`
    card.append(number, title, detail)
    relatedGrid.appendChild(card)
  }

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
