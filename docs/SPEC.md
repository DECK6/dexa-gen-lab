# DEXA GEN LAB — 설계 스펙 v2

2026-08-01. 카탈로그: [CATALOG.md](./CATALOG.md) (20 카테고리 / 200종). 진행 원장: [PROGRESS.md](./PROGRESS.md)

## 1. 개요

크리에이티브 코딩(제너러티브 아트 / 알고리즘 아트) 샘플을 브라우저에서 **라이브로 감상하고**, 시드를 바꿔 **변주를 생성하고**, **소스 코드를 가져가는** 카탈로그 사이트.

- **엔진**: p5.js (160종) + three.js (40종 — GLSL 셰이더 10종 포함)
- **배포**: `dexa.art/gen` (GitHub Pages — `adxdeck-dexa-daily-main/gen/`, `vfx/` 패턴과 동일)
- **소스 레포**: `/Volumes/data/Dev/dexa-gen-lab` (별도), 산출물만 adxdeck에 복사
- vfx-lab과 달리 **프레임워크 중립 커널·Remotion·내보내기 어댑터 없음** — 스케치는 엔진 API를 직접 사용한다. 단순함 우선.

## 2. 아키텍처 원칙 (하드 룰)

1. **확장 = 파일 드롭.** `sketches/<category>/<ID>_<slug>.meta.ts` + `.sketch.ts` 쌍 추가만으로 갤러리에 등장. 기존 코드 수정 필요 시 설계 위반.
2. **결정성.** `Math.random` · `Date.now` · `performance.now` 사용 금지(린트 차단). 난수는 ① p5: `p.random`/`p.noise`(러너가 시드 주입) ② 그 외: `ctx.random`(시드 mulberry32). 같은 시드 → 같은 작품.
3. **팔레트는 중앙 토큰만.** 색은 `ctx.palette` 필드만 사용. `.sketch.ts` 안의 hex 리터럴(`#...`)은 린트 차단. 알파/보간은 엔진 API로(`p.color(pal.signal)` + `setAlpha`, `new THREE.Color(pal.signal)`). GLSL 내부 색상은 shaderQuad가 주입하는 팔레트 uniform 사용.
4. **캔버스는 1:1 정사각.** 크기는 러너가 결정(`ctx.width/height`, 기본 640×640). 스케치는 하드코딩 금지.
5. **모든 스케치는 애니메이션.** 최소한 느린 진화라도 움직여야 한다. `noLoop()` 금지.

## 3. 스케치 계약 (src/types.ts가 소스 오브 트루스)

```ts
interface SketchCtx {
  width: number; height: number;   // 러너가 결정, 1:1
  seed: number;                    // 재생성 버튼이 새 시드 주입
  random: () => number;            // mulberry32(seed), [0,1)
  palette: Palette;                // { bg, ink, signal, accent, paper, dim }
}
```

### p5 스케치 (`engine: 'p5'`)

```ts
import type P5 from 'p5'
import type { SketchCtx } from '../../src/types'

export function sketch(p: P5, ctx: SketchCtx): void {
  p.setup = () => { p.createCanvas(ctx.width, ctx.height) }
  p.draw = () => { /* p.frameCount 기반 애니메이션 */ }
}
```

- 인스턴스 모드만. 러너가 `p.setup` 실행 **직전에** `p.randomSeed(ctx.seed)` / `p.noiseSeed(ctx.seed)`를 호출하므로 `p.random`/`p.noise`는 그대로 써도 결정적.
- 시간축은 `p.frameCount`만 사용 (`p.millis()` 금지 — 썸네일 결정성).
- `p.createCanvas(ctx.width, ctx.height)`는 setup 첫 줄 필수.

### three 스케치 (`engine: 'three'`)

```ts
import * as THREE from 'three'
import type { SketchCtx, ThreeSketch } from '../../src/types'

export function sketch(ctx: SketchCtx): ThreeSketch {
  // scene/camera 구성, ctx.random으로 결정적 배치
  return { scene, camera, update(t, dt) { /* t=초, 러너 클럭 */ }, dispose() {...} }
}
```

- 러너가 `WebGLRenderer`·rAF·리사이즈를 소유. 스케치는 `update(t, dt)`에서 `t`(초)만 신뢰 (실시간 클럭 직접 접근 금지).
- `dispose()`에서 geometry/material 해제.
- **SHADER 카테고리**: `src/lib/shaderQuad.ts` 헬퍼 사용 — fragment shader 문자열만 작성.

```ts
import { shaderQuad } from '../../src/lib/shaderQuad'
export function sketch(ctx: SketchCtx): ThreeSketch {
  return shaderQuad(ctx, FRAG)  // uTime(초)·uSeed·uRes·uColBg/uColSignal/uColAccent/uColPaper 자동 주입
}
```

## 4. 파일 규약 & 레지스트리

```
sketches/<category>/<ID>_<slug>.meta.ts     ← export default { id, slug, title, category, engine, tags, description } satisfies SketchMeta
sketches/<category>/<ID>_<slug>.sketch.ts   ← export function sketch(...)
```

- meta: `import.meta.glob('../sketches/**/*.meta.ts', { eager: true })` — 갤러리가 스케치 코드 로드 없이 전 목록 렌더.
- sketch: lazy glob — 카드 활성화/상세 진입 시에만 청크 로드.
- 코드 뷰: `import.meta.glob('...sketch.ts', { query: '?raw' })` lazy — 상세 페이지 소스 표시 + 복사.
- **lint-registry 검증** (위반 시 빌드 실패): ID 중복 · meta/sketch 쌍 불일치 · 폴더-category 불일치 · ID-파일명 불일치 · `Math.random`/`Date.now`/`performance.now`/`p.millis` · `.sketch.ts` 내 hex 리터럴 · `noLoop(` 호출.

## 5. 러너 & 갤러리

### 러너

- `runner/p5.ts`: 마운트 시 `new p5(wrapper, container)` — wrapper가 시드 주입 후 사용자 sketch 호출. 언마운트 시 `p.remove()`.
- `runner/three.ts`: 마운트 시 renderer 생성(640×640, dpr≤2), rAF 루프에서 `update(t, dt)` 후 render. 언마운트 시 renderer.dispose + sketch.dispose.
- **썸네일 모드** (`?thumb=1`): 실시간 rAF 대신 고정 dt(1/60)로 90프레임 스텝 후 정지, `window.__SKETCH_READY__ = true` 세팅. 스크린샷 결정성 확보.

### 갤러리 (`/gen/`)

- VFX LAB과 동일한 문법의 헤더(GALLERY/ABOUT) + 좌측 카테고리 필터 레일(20) + 엔진 필터(P5/THREE) + 검색/결과 카운트.
- 1:1 카드 그리드: 기본은 정지 썸네일(`public/thumbs/<id>.webp`), **hover/focus 시 라이브 마운트** (동시 라이브 상한 3, three는 1 — GL 컨텍스트 한도), leave 시 언마운트.
- 카드 라벨: JetBrains Mono 11px 대문자 — `FD01 / PERLIN FLOW / P5`.
- 라우팅은 해시(`#/s/<id>`, `#/about`). Vite `base: '/gen/'`.

### 상세 (`#/s/<id>`)

- VFX LAB의 workbench 구성을 따른 라이브 정사각 프리뷰 + 현재 시드 표시 + **REGENERATE**(새 시드로 리마운트) + 소스 콘솔(복사 버튼) + 관련 작품 카드.

### 프리뷰 하네스 (`#/p/<id>?seed=N&thumb=1`)

- 크롬 없이 캔버스만 — 썸네일 스크립트와 e2e 테스트 전용.

## 6. DEXA 테마

`dexa-theme.css` 토큰 재사용(adxdeck 복사본), hex 재정의 금지. vfx와 동일 문법: **라이트 크롬(Paper 셸) + 다크 전시면(Ink 캔버스)**.

| 역할 | 토큰 |
|---|---|
| 페이지 셸·필터 | Paper `--paper` |
| 카드 몸체 | Panel `--panel` (hover `--panel2`) |
| 캔버스 인셋 면 | `--ink-display` |
| 작품 기본 신호색 | Cyan `--cyan` |
| 필터 활성·포커스·복사 버튼 | Orange `--orange` |

스케치 팔레트(`src/palette.ts` = 유일한 hex 정의처): `bg #0D0E10 · ink #17181B · signal #5EE7F3 · accent #FF5A1F · paper #F5F1E6 · dim #5A5D63`. 기본 룩 = **Ink 바탕 + Cyan 주선 + Orange 포인트** — 갤러리 전체가 하나의 계측기 시스템으로 읽히게. accent/paper는 소량만.

## 7. 스택

- **bun** + Vite + TypeScript strict + **vanilla DOM** (프레임워크 없음)
- p5 + three (+ @types), 상태 관리 없음 — URL 해시 + 로컬 상태
- 스타일: `src/theme/dexa-theme.css` 복사본 + `src/style.css`

## 8. 검증 게이트 (배치·전체 공통)

| 순서 | 명령 | 검증 |
|---|---|---|
| 1 | `bun run lint:registry` | 파일 규약·금지 패턴 |
| 2 | `bun run typecheck` | tsc --noEmit strict |
| 3 | `bun run build` | vite build (lint+tsc 포함) |
| 4 | `bun run thumbs` | 200장 썸네일 생성 = 렌더 게이트 겸용 (블랭크 캔버스 감지 시 실패) |
| 5 | `bun run test:e2e` | VFX형 제품 셸 + 200개 프리뷰의 non-blank + 프레임 간 변화(alive), 총 202 checks |

## 9. 성능 가드

- 갤러리 라이브 카드 640×640 기준 60fps 목표. 픽셀 단위 연산(만델브로트·reaction-diffusion 등)은 **저해상 오프스크린 버퍼(≤160²) + 업스케일**.
- 파티클 수 상한 ~3000 (p5), three points ~100k.
- 스케치 1개 ≤ 150줄 권장 — 샘플은 읽히는 코드가 제품이다.

## 10. 배포

`scripts/deploy.sh`: `bun run build` → `dist/*` → `/Volumes/data/Dev/adxdeck-dexa-daily-main/gen/` 카피 + thumbs 포함. **git push는 항상 사용자 승인 게이트.**
