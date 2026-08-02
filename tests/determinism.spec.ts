import { chromium, expect, test } from '@playwright/test'

const LAUNCH_ARGS = [
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
]

function checksum(bytes: Uint8Array): string {
  let value = 2_166_136_261
  for (const byte of bytes) {
    value ^= byte
    value = Math.imul(value, 16_777_619)
  }
  return `${bytes.length}:${(value >>> 0).toString(16)}`
}

test('TX02 fixed-frame thumbnail is deterministic across cold browsers', async ({ baseURL }) => {
  test.setTimeout(60_000)
  const hashes: string[] = []

  for (let run = 0; run < 4; run++) {
    const browser = await chromium.launch({ args: LAUNCH_ARGS })
    try {
      const context = await browser.newContext({
        viewport: { width: 400, height: 400 },
        deviceScaleFactor: 1,
      })
      const page = await context.newPage()
      await page.goto(`${baseURL}?run=${run}#/p/TX02?seed=7&thumb=1&size=320`, {
        waitUntil: 'load',
      })
      await page.waitForFunction(() => window.__SKETCH_READY__ === true, undefined, {
        timeout: 30_000,
      })
      const png = await page.locator('canvas').first().screenshot({ type: 'png' })
      hashes.push(checksum(png))
    } finally {
      await browser.close()
    }
  }

  expect(new Set(hashes).size, `cold-browser hashes: ${hashes.join(', ')}`).toBe(1)
})
