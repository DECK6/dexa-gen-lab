# PROGRESS — DEXA GEN LAB

골: VFX LAB과 통일된 크리에이티브코딩 카탈로그 **500종** (p5/three) → dexa.art/gen. (v3 확장: 설계 Fable / 구현 Codex gpt-5.6-sol. 종료 조건: 500종 검수 + GitHub 푸시 + dexa.art 라이브 확인)

## Waves

- [x] **W0 설계+스캐폴드** — docs/계약/골든 3종(Fable) + 러너·갤러리·스크립트·테스트(opus:scaffold) 완료 (2026-08-01)
- [x] **W1 스케치 97종** — 10/10 배치 정적 게이트 통과, meta 100종 확보 (2026-08-01)
- [x] **W2 통합 게이트** — lint 100/100 · tsc · build · thumbs 100/100 · e2e 101/101 그린 (2026-08-01)
  - 반려 이력: CH03 블랭크(퇴화 파라미터, Fable 직접 수정) / CH01·03·04·05·07·10 + OR06 초반 밝기·전개 부족(담당 에이전트 재작업 1회) → 전부 통과
- [x] **W2 배포 카피** adxdeck gen/ (index/assets/thumbs 100) 및 최초 공개 (2026-08-01)
- [x] **W3 VFX형 제품 셸** — 공통 헤더·좌측 필터 레일·갤러리 툴바·workbench 상세·KO/EN ABOUT 적용 (2026-08-01)
- [x] **W4 카탈로그 100종 확장** — WAVE/OPTICS/DATA/SYSTEM/KINETIC/TEXTILE/FLUID/MINIMAL/TOPOLOGY/COSMIC 각 10종 (2026-08-01)
- [x] **W5 v2 통합 게이트** — lint 200/200 · tsc · build · thumbs 200/200 · e2e 202/202 (2026-08-01)
- [x] **W6 카탈로그 300종 확장 (v3, →500)** — 20개 배치·600파일 구현, 500 meta/sketch 계약 및 W6 300종 근접·차별 감사 완료 (2026-08-02)
- [x] **W6 통합 게이트** — registry 500/500 · catalog audit 300/300 및 104,850쌍 · audit unit 3/3 · tsc · build · thumbs 500/500 × 2회(SHA 변경 0) · e2e 503/503 (2026-08-02)
- [ ] **W6 배포** — adxdeck gen/ 카피 → GitHub 푸시 → dexa.art/gen 라이브 500 확인

## 배치 원장

| 배치 | 범위 | 담당 | 상태 | 게이트 |
|---|---|---|---|---|
| W0-core | contracts+골든3 | Fable | 완료 | tsc 그린 |
| W0-scaffold | src/ui·runner·scripts·tests | opus:scaffold | 완료 | tsc·build·e2e |
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

## W6 배치 원장 (Codex gpt-5.6-sol × 20, pumasi)

| 배치 | 범위 | 상태 | 게이트 |
|---|---|---|---|
| W6-field | FD11~FD25 (15) | 구현 완료 | registry·catalog audit |
| W6-particle | PT11~PT25 (15) | 구현 완료 | registry·catalog audit |
| W6-geometry | GM11~GM25 (15) | 구현 완료 | registry·catalog audit |
| W6-fractal | FR11~FR25 (15) | 구현 완료 | registry·catalog audit |
| W6-automata | CA11~CA25 (15) | 구현 완료 | registry·catalog audit |
| W6-organic | OR11~OR25 (15) | 구현 완료 | registry·catalog audit |
| W6-glyph | TX11~TX25 (15) | 구현 완료 | registry·catalog audit |
| W6-space | TD11~TD25 (15) | 구현 완료 | registry·catalog audit |
| W6-shader | SH11~SH25 (15) | 구현 완료 | registry·catalog audit |
| W6-chaos | CH11~CH25 (15) | 구현 완료 | registry·catalog audit |
| W6-wave | WV11~WV25 (15) | 구현 완료 | registry·catalog audit |
| W6-optics | OP11~OP25 (15) | 구현 완료 | registry·catalog audit |
| W6-data | DT11~DT25 (15) | 구현 완료 | registry·catalog audit |
| W6-system | SY11~SY25 (15) | 구현 완료 | registry·catalog audit |
| W6-kinetic | KN11~KN25 (15) | 구현 완료 | registry·catalog audit |
| W6-textile | TL11~TL25 (15) | 구현 완료 | registry·catalog audit |
| W6-fluid | FL11~FL25 (15) | 구현 완료 | registry·catalog audit |
| W6-minimal | MN11~MN25 (15) | 구현 완료 | registry·catalog audit |
| W6-topology | TP11~TP25 (15) | 구현 완료 | registry·catalog audit |
| W6-cosmic | CS11~CS25 (15) | 구현 완료 | registry·catalog audit |

## 메모

- **근접 이웃 게이트(v3)**: 발주문에 근접 ID·차별점 명시 의무. 같은 알고리즘 파라미터 변형으로 개수 채우기 반려 (SPEC §2-6).
- **W6 정적 감사**: 카탈로그↔meta 500건 일치, W6 차별 선언 300/300, W6 포함 정규화 소스 104,850쌍 비교에서 복제 임계 초과 0건. 최유사 8쌍은 규칙·역학·구조 차이를 직접 확인 (2026-08-02).
- **W6 렌더 회귀**: 첫 전수에서 CH14·CH17 썸네일 저대비를 검출해 Gumowski–Mira 표준 재귀식과 Chua 표시 대비를 교정. 첫 E2E 500/502에서 CH22·MN21 표시 면적을 보강했다. 이후 전수 재현성 비교에서 TX02의 웹폰트 로드 경합을 발견해 프리뷰가 JetBrains Mono 로드를 기다리도록 수정하고 cold-browser 회귀 테스트를 추가했다. 최종 thumbs 500/500 2회가 SHA-256 변경 0건, E2E 503/503으로 통과 (2026-08-02).
- v2 회귀: SY01의 성긴 네트워크가 블랭크 임계치에 걸려 배경 계측 그리드와 대비를 보강한 뒤 재검증.
- 환경: p5@2.3 런타임 + @types/p5@1.7 (클래식 API만), three@0.185, TS7 strict, vite8.
