import { CATEGORIES, ENGINES, SKETCHES, type SketchEntry } from '../registry'
import { mountSketch, type SketchHandle } from '../runner'
import type { CategoryId, Engine } from '../types'

const CARD_SIZE = 320
const CARD_SEED = 7
const MAX_LIVE = 3
const MAX_LIVE_THREE = 1
const LEAVE_DELAY = 300

interface LiveCard {
  entry: SketchEntry
  slot: HTMLElement
  handle: SketchHandle | null
  disposed: boolean
}

export function mountGallery(root: HTMLElement): { destroy: () => void } {
  let category: CategoryId | null = null
  let engine: Engine | null = null
  let query = ''

  root.innerHTML = `
    <header class="site-head">
      <a class="brand" href="#/">DEXA GEN LAB<span class="dot">.</span></a>
      <span class="head-tag mono">GENERATIVE ART CATALOG · P5 + THREE</span>
      <a class="head-link mono" href="https://dexa.art">DEXA.ART ↗</a>
    </header>
    <main class="gallery">
      <div class="filters">
        <div class="chip-row" data-role="categories"></div>
        <div class="filter-tail">
          <div class="chip-row" data-role="engines"></div>
          <label class="search mono">
            <span>SEARCH</span>
            <input type="search" placeholder="ID / TITLE / TAG" />
          </label>
          <span class="count mono" data-role="count"></span>
        </div>
      </div>
      <div class="grid" data-role="grid"></div>
      <p class="empty mono" data-role="empty" hidden>NO SKETCH ON SIGNAL</p>
    </main>
  `

  const categoryRow = root.querySelector<HTMLElement>('[data-role="categories"]')!
  const engineRow = root.querySelector<HTMLElement>('[data-role="engines"]')!
  const grid = root.querySelector<HTMLElement>('[data-role="grid"]')!
  const countEl = root.querySelector<HTMLElement>('[data-role="count"]')!
  const emptyEl = root.querySelector<HTMLElement>('[data-role="empty"]')!
  const search = root.querySelector<HTMLInputElement>('.search input')!

  const live = new Map<string, LiveCard>()
  const leaveTimers = new Map<string, number>()

  function unmount(id: string) {
    const card = live.get(id)
    if (!card) return
    live.delete(id)
    card.disposed = true
    card.handle?.destroy()
    card.slot.classList.remove('is-live')
    card.slot.replaceChildren()
  }

  function evictFor(next: Engine) {
    if (next === 'three') {
      let threeCount = 0
      for (const card of live.values()) if (card.entry.meta.engine === 'three') threeCount++
      while (threeCount >= MAX_LIVE_THREE) {
        const oldest = [...live.entries()].find(([, card]) => card.entry.meta.engine === 'three')
        if (!oldest) break
        unmount(oldest[0])
        threeCount--
      }
    }
    while (live.size >= MAX_LIVE) {
      const oldest = live.keys().next()
      if (oldest.done) break
      unmount(oldest.value)
    }
  }

  async function activate(entry: SketchEntry, slot: HTMLElement) {
    const id = entry.meta.id
    const timer = leaveTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      leaveTimers.delete(id)
    }
    if (live.has(id)) return

    evictFor(entry.meta.engine)
    const card: LiveCard = { entry, slot, handle: null, disposed: false }
    live.set(id, card)
    slot.classList.add('is-live')

    try {
      const handle = await mountSketch(slot, entry, { seed: CARD_SEED, size: CARD_SIZE })
      if (card.disposed) handle.destroy()
      else card.handle = handle
    } catch (error) {
      console.error(`gallery: ${id} failed to mount`, error)
      unmount(id)
    }
  }

  function scheduleUnmount(id: string) {
    if (!live.has(id) || leaveTimers.has(id)) return
    leaveTimers.set(
      id,
      window.setTimeout(() => {
        leaveTimers.delete(id)
        unmount(id)
      }, LEAVE_DELAY),
    )
  }

  const cards = SKETCHES.map((entry) => {
    const { id, title, engine: eng } = entry.meta
    const card = document.createElement('a')
    card.className = 'card'
    card.href = `#/s/${id}`
    card.innerHTML = `
      <div class="stage card-stage">
        <img class="card-thumb" alt="" loading="lazy" src="${import.meta.env.BASE_URL}thumbs/${id}.jpg" />
        <div class="card-live"></div>
      </div>
      <div class="card-label mono">${id} / ${title} / ${eng.toUpperCase()}</div>
    `
    const stage = card.querySelector<HTMLElement>('.card-stage')!
    const slot = card.querySelector<HTMLElement>('.card-live')!
    const thumb = card.querySelector<HTMLImageElement>('.card-thumb')!
    thumb.addEventListener('error', () => {
      thumb.remove()
      stage.classList.add('is-empty')
    })
    card.addEventListener('pointerenter', () => void activate(entry, slot))
    card.addEventListener('pointerleave', () => scheduleUnmount(id))
    card.addEventListener('focus', () => void activate(entry, slot))
    card.addEventListener('blur', () => scheduleUnmount(id))
    grid.appendChild(card)
    return { entry, card }
  })

  function chip(label: string, active: boolean, onClick: () => void) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = active ? 'chip mono is-active' : 'chip mono'
    button.textContent = label
    button.addEventListener('click', onClick)
    return button
  }

  function renderChips() {
    categoryRow.replaceChildren(
      chip('ALL', category === null, () => {
        category = null
        render()
      }),
      ...CATEGORIES.map((item) =>
        chip(item.label, category === item.id, () => {
          category = category === item.id ? null : item.id
          render()
        }),
      ),
    )
    engineRow.replaceChildren(
      ...ENGINES.map((item) =>
        chip(item.toUpperCase(), engine === item, () => {
          engine = engine === item ? null : item
          render()
        }),
      ),
    )
  }

  function matches(entry: SketchEntry) {
    const { meta } = entry
    if (category && meta.category !== category) return false
    if (engine && meta.engine !== engine) return false
    if (!query) return true
    const needle = query.toLowerCase()
    return [meta.id, meta.title, meta.slug, ...meta.tags].some((value) =>
      value.toLowerCase().includes(needle),
    )
  }

  function render() {
    renderChips()
    let visible = 0
    for (const { entry, card } of cards) {
      const show = matches(entry)
      card.hidden = !show
      if (show) visible++
      else unmount(entry.meta.id)
    }
    countEl.textContent = `${visible} / ${SKETCHES.length}`
    emptyEl.hidden = visible > 0
  }

  search.addEventListener('input', () => {
    query = search.value.trim()
    render()
  })

  render()

  return {
    destroy: () => {
      for (const timer of leaveTimers.values()) clearTimeout(timer)
      leaveTimers.clear()
      for (const id of [...live.keys()]) unmount(id)
      root.replaceChildren()
    },
  }
}
