# PROGRESS — DEXA GEN LAB

골: VFX LAB과 통일된 크리에이티브코딩 카탈로그 200종 (p5/three) → dexa.art/gen.

## Waves

- [x] **W0 설계+스캐폴드** — docs/계약/골든 3종(Fable) + 러너·갤러리·스크립트·테스트(opus:scaffold) 완료 (2026-08-01)
- [x] **W1 스케치 97종** — 10/10 배치 정적 게이트 통과, meta 100종 확보 (2026-08-01)
- [x] **W2 통합 게이트** — lint 100/100 · tsc · build · thumbs 100/100 · e2e 101/101 그린 (2026-08-01)
  - 반려 이력: CH03 블랭크(퇴화 파라미터, Fable 직접 수정) / CH01·03·04·05·07·10 + OR06 초반 밝기·전개 부족(담당 에이전트 재작업 1회) → 전부 통과
- [x] **W2 배포 카피** adxdeck gen/ (index/assets/thumbs 100) 및 최초 공개 (2026-08-01)
- [x] **W3 VFX형 제품 셸** — 공통 헤더·좌측 필터 레일·갤러리 툴바·workbench 상세·KO/EN ABOUT 적용 (2026-08-01)
- [x] **W4 카탈로그 100종 확장** — WAVE/OPTICS/DATA/SYSTEM/KINETIC/TEXTILE/FLUID/MINIMAL/TOPOLOGY/COSMIC 각 10종 (2026-08-01)
- [x] **W5 v2 통합 게이트** — lint 200/200 · tsc · build · thumbs 200/200 · e2e 202/202 (2026-08-01)

## 배치 원장

| 배치 | 범위 | 담당 | 상태 | 게이트 |
|---|---|---|---|---|
| W0-core | contracts+골든3 | Fable | 완료 | tsc 그린 |
| W0-scaffold | src/ui·runner·scripts·tests | opus:scaffold | 발주 2026-08-01 | - |
| W1-field | FD02~FD10 (9) | opus:w1-field | 완료 | tsc 0에러·금지패턴 0 |
| W1-particle | PT01~PT10 (10) | opus:w1-particle | 완료 | tsc 0에러·금지패턴 0 |
| W1-geometry | GM01~GM10 (10) | opus:w1-geometry | 완료 | tsc 0에러·금지패턴 0 |
| W1-fractal | FR01~FR10 (10) | opus:w1-fractal | 완료 | tsc 0에러·금지패턴 0 |
| W1-automata | CA01~CA10 (10) | opus:w1-automata | 완료 | tsc 0에러·금지패턴 0 |
| W1-organic | OR01~OR10 (10) | opus:w1-organic | 완료 | tsc 0에러·금지패턴 0 |
| W1-glyph | TX01~TX10 (10) | opus:w1-glyph | 완료 | tsc 0에러·금지패턴 0 |
| W1-space | TD02~TD10 (9) | opus:w1-space | 완료 | tsc 0에러·dispose·ctx.random 전종 확인 |
| W1-shader | SH02~SH10 (9) | opus:w1-shader | 완료 | tsc 0에러·금지패턴 0 (GLSL 컴파일은 W2) |
| W1-chaos | CH01~CH10 (10) | opus:w1-chaos | 완료 | tsc 0에러·금지패턴 0 |
| W4-wave | WV01~WV10 (10) | Codex | 완료 | lint·tsc·render |
| W4-optics | OP01~OP10 (10) | Codex | 완료 | lint·tsc·render |
| W4-data | DT01~DT10 (10) | Codex | 완료 | lint·tsc·render |
| W4-system | SY01~SY10 (10) | Codex | 완료 | lint·tsc·render |
| W4-kinetic | KN01~KN10 (10) | Codex | 완료 | lint·tsc·render |
| W4-textile | TL01~TL10 (10) | Codex | 완료 | lint·tsc·render |
| W4-fluid | FL01~FL10 (10) | Codex | 완료 | lint·tsc·render |
| W4-minimal | MN01~MN10 (10) | Codex | 완료 | lint·tsc·render |
| W4-topology | TP01~TP10 (10) | Codex | 완료 | lint·tsc·render·dispose |
| W4-cosmic | CS01~CS10 (10) | Codex | 완료 | lint·tsc·render·dispose |

## 메모

- v2 회귀: SY01의 성긴 네트워크가 블랭크 임계치에 걸려 배경 계측 그리드와 대비를 보강한 뒤 재검증.
- 환경: p5@2.3 런타임 + @types/p5@1.7 (클래식 API만), three@0.185, TS7 strict, vite8.
