# PROGRESS — DEXA GEN LAB

골: 크리에이티브코딩 카탈로그 100종 (p5/three) → dexa.art/gen. 설계 Fable / 구현 opus-5. 원장은 배치 단위 즉시 갱신.

## Waves

- [x] **W0 설계+스캐폴드** — docs/계약/골든 3종(Fable) + 러너·갤러리·스크립트·테스트(opus:scaffold) 완료 (2026-08-01)
- [x] **W1 스케치 97종** — 10/10 배치 정적 게이트 통과, meta 100종 확보 (2026-08-01)
- [x] **W2 통합 게이트** — lint 100/100 · tsc · build · thumbs 100/100 · e2e 101/101 그린 (2026-08-01)
  - 반려 이력: CH03 블랭크(퇴화 파라미터, Fable 직접 수정) / CH01·03·04·05·07·10 + OR06 초반 밝기·전개 부족(담당 에이전트 재작업 1회) → 전부 통과
- [x] **W2 배포 카피** adxdeck gen/ (index/assets/thumbs 100) — **push는 사용자 승인 대기**

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

## 메모

- 파일 소유 경계: 각 W1 에이전트는 `sketches/<자기 카테고리>/`만 생성·수정. 공용 파일 수정 금지.
- 반려 2회 → Fable 직접 수정으로 에스컬레이션.
- 환경: p5@2.3 런타임 + @types/p5@1.7 (클래식 API만), three@0.185, TS7 strict, vite8.
