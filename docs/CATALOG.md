# DEXA GEN LAB — 카탈로그 v1 (10 카테고리 × 10종 = 100)

ID 규칙: 카테고리 접두 2자 + 2자리. `★` = 골든 레퍼런스(Fable 구현, 나머지는 발주 대상).
title은 영문 대문자, description은 한 줄 한국어. 모든 스케치는 애니메이션(§SPEC 2-5).

## FIELD — 벡터장·흐름 (`field`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| FD01 ★ | perlin-flow | PERLIN FLOW | 펄린 노이즈 벡터장을 따라 흐르는 파티클 트레일 |
| FD02 | curl-drift | CURL DRIFT | 컬 노이즈 유선(divergence-free)이 만드는 매끄러운 소용돌이 흐름 |
| FD03 | magnet-lines | MAGNET LINES | 쌍극자(N/S) 자기장 라인 트레이싱, 극 위치가 천천히 공전 |
| FD04 | wind-ribbons | WIND RIBBONS | 시간 변화 노이즈장에 밀려 나부끼는 리본 다발 |
| FD05 | gravity-wells | GRAVITY WELLS | 점질량 3~5개의 중력장을 지나는 시험 입자 궤적 |
| FD06 | sine-lattice | SINE LATTICE | 사인파 중첩 벡터 격자 — 위상이 흐르며 만드는 간섭 무늬 |
| FD07 | contour-flow | CONTOUR FLOW | 노이즈 등고선(isoline)을 따라 그려지는 지형도풍 곡선들 |
| FD08 | vortex-street | VORTEX STREET | 회전 방향이 엇갈린 보텍스 열이 입자를 휘감아 끄는 흐름 |
| FD09 | grid-needles | GRID NEEDLES | 계기판풍 화살표/바늘 격자가 장의 방향·세기를 실시간 표시 |
| FD10 | stream-spores | STREAM SPORES | 유선 위에서 태어나고 소멸하는 포자 입자의 생멸 순환 |

## PARTICLE — 입자계 (`particle`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| PT01 | orbit-swarm | ORBIT SWARM | 중심 인력체 주위를 도는 입자 무리의 궤도 트레일 |
| PT02 | boids | BOIDS | 분리·정렬·응집 3규칙 플로킹 |
| PT03 | pulse-fireflies | PULSE FIREFLIES | 위상 결합으로 점멸이 동기화되어 가는 반딧불 무리 |
| PT04 | sand-fall | SAND FALL | 떨어져 쌓이는 모래 더미 — 안식각을 넘으면 흘러내림 |
| PT05 | repulse-grid | REPULSE GRID | 격자 입자들이 순회하는 반발체를 피했다가 제자리로 복귀 |
| PT06 | chain-springs | CHAIN SPRINGS | 버렛 적분 스프링 체인 여러 가닥의 흔들림 |
| PT07 | billiard-gas | BILLIARD GAS | 탄성 충돌 입자 기체 — 충돌 순간 섬광 표시 |
| PT08 | galaxy-spin | GALAXY SPIN | 차등 회전하는 나선 성단 입자 원반 |
| PT09 | rain-splash | RAIN SPLASH | 낙하 입자가 바닥에서 튀며 2차 입자를 낳는 비 |
| PT10 | species-duet | SPECIES DUET | 서로 끌고 미는 두 입자 종(種)이 만드는 경계 무늬 |

## GEOMETRY — 기하·타일링 (`geometry`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| GM01 | truchet-turn | TRUCHET TURN | 사분원 트루셰 타일 격자가 물결처럼 회전 |
| GM02 | circle-pack | CIRCLE PACK | 자라나는 원 채우기 — 충돌하면 성장 정지 |
| GM03 | voronoi-relax | VORONOI RELAX | 로이드 완화로 균질해지는 보로노이 셀 |
| GM04 | iso-swell | ISO SWELL | 아이소메트릭 큐브 격자의 높이 파동 |
| GM05 | polygon-morph | POLYGON MORPH | 정다각형 링들이 변 수를 바꾸며 보간 |
| GM06 | maze-carve | MAZE CARVE | 재귀 백트래커가 미로를 파 나가는 과정 |
| GM07 | hex-pulse | HEX PULSE | 육각 격자 위 방사형 펄스 웨이브 |
| GM08 | quad-split | QUAD SPLIT | 사각형 재귀 분할 — 분할선이 순차적으로 그어짐 |
| GM09 | spiro-rings | SPIRO RINGS | 에피트로코이드(스피로그래프) 곡선 가족 |
| GM10 | arc-lattice | ARC LATTICE | 겹치는 원호 격자의 모아레 리듬 |

## FRACTAL — 프랙탈·재귀 (`fractal`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| FR01 | lsystem-grove | LSYSTEM GROVE | L-시스템 규칙으로 자라나는 수풀 |
| FR02 | koch-bloom | KOCH BLOOM | 코흐 눈송이 세대 전환 모핑 |
| FR03 | dragon-unfold | DRAGON UNFOLD | 드래곤 커브가 접혔다 펼쳐지는 애니메이션 |
| FR04 | mandel-drift | MANDEL DRIFT | 만델브로트 경계를 따라 표류하는 느린 줌 (저해상 버퍼) |
| FR05 | julia-orbit | JULIA ORBIT | c 파라미터가 원을 돌며 변형되는 줄리아 집합 (저해상 버퍼) |
| FR06 | chaos-game | CHAOS GAME | 카오스 게임 점 축적 — 꼭짓점 수가 주기적으로 변경 |
| FR07 | fern-rain | FERN RAIN | 반슬리 고사리 IFS 점이 비처럼 쌓임 |
| FR08 | wind-tree | WIND TREE | 바람에 흔들리는 재귀 가지 나무 |
| FR09 | tangent-nest | TANGENT NEST | 서로 접하는 원 안에 원 — 재귀 중첩이 숨쉬듯 스케일 |
| FR10 | hilbert-glow | HILBERT GLOW | 힐베르트 곡선을 따라 달리는 발광 헤드와 잔광 |

## AUTOMATA — 셀룰러 오토마타 (`automata`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| CA01 | game-of-life | GAME OF LIFE | 콘웨이 생명 게임 — 주기적 리시드로 영원히 |
| CA02 | rule-scroll | RULE SCROLL | 1차원 CA(rule 30/90/110 순환)가 아래로 스크롤 |
| CA03 | gray-scott | GRAY SCOTT | 반응-확산 패턴 성장 (저해상 버퍼) |
| CA04 | sandpile | SANDPILE | 아벨리안 모래더미 — 중앙 투하와 사태 확산 |
| CA05 | langton-ant | LANGTON ANT | 랭턴 개미 여러 마리가 만드는 고속도로 |
| CA06 | brians-brain | BRIANS BRAIN | 발화-휴지-소멸 3상태 CA의 파도 |
| CA07 | cyclic-storm | CYCLIC STORM | 순환 CA(가위바위보)의 나선 폭풍 |
| CA08 | dla-frost | DLA FROST | 확산 제한 응집 — 서리처럼 자라는 결정 |
| CA09 | vote-erode | VOTE ERODE | 다수결 CA가 노이즈를 침식해 섬을 만드는 과정 |
| CA10 | forest-fire | FOREST FIRE | 성장-발화-소멸 산불 모델의 순환 |

## ORGANIC — 유기적 성장 (`organic`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| OR01 | diff-ring | DIFF RING | 미분 성장(differential growth)으로 주름져 가는 링 |
| OR02 | venation | VENATION | 공간 식민화 알고리즘의 잎맥 성장 |
| OR03 | noise-worms | NOISE WORMS | 노이즈 방향으로 기어 다니는 분절 벌레들 |
| OR04 | lichen-spread | LICHEN SPREAD | 가장자리에서 확률적으로 번지는 이끼 군락 |
| OR05 | kelp-sway | KELP SWAY | 물살에 흔들리는 켈프 줄기 숲 |
| OR06 | cell-divide | CELL DIVIDE | 분열하며 서로 밀어내는 세포 군집 |
| OR07 | root-reach | ROOT REACH | 중력·수분 지향성을 가진 뿌리의 탐색 성장 |
| OR08 | coral-eden | CORAL EDEN | 에덴 성장 모델의 산호 군체 |
| OR09 | mycelium | MYCELIUM | 분기·융합하는 균사 네트워크 |
| OR10 | phyllotaxis | PHYLLOTAXIS | 보겔 나선 배열로 피어나는 꽃 |

## GLYPH — 문자·기호 (`glyph`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| TX01 | ascii-tide | ASCII TIDE | 노이즈 밀도를 ASCII 문자 계조로 렌더한 조수 |
| TX02 | type-scatter | TYPE SCATTER | 낱글자들이 흩어졌다 단어로 응집하는 순환 |
| TX03 | dot-matrix | DOT MATRIX | 도트 매트릭스 전광판을 훑고 지나가는 웨이브 |
| TX04 | barcode-rhythm | BARCODE RHYTHM | 폭·간격이 규칙적으로 변주되는 제너러티브 바코드 |
| TX05 | morse-rings | MORSE RINGS | 모스 부호 리듬으로 방사되는 동심원 펄스 |
| TX06 | lissajous-script | LISSAJOUS SCRIPT | 리사주 곡선이 쓰는 서명 같은 필기 |
| TX07 | counter-columns | COUNTER COLUMNS | 계기판 숫자 열들이 서로 다른 속도로 롤링 |
| TX08 | punch-card | PUNCH CARD | 천공 카드 패턴이 연산하듯 갱신되는 격자 |
| TX09 | glyph-mutate | GLYPH MUTATE | 격자 위 기호들이 세대를 거치며 돌연변이 |
| TX10 | braille-drift | BRAILLE DRIFT | 점자 도트 필드에 흐르는 언어의 물결 |

## SPACE — 3D 공간 (`space`, three)

| ID | slug | title | 설명 |
|---|---|---|---|
| TD01 ★ | instanced-swell | INSTANCED SWELL | 인스턴스드 큐브 격자의 노이즈 높이 파동 |
| TD02 | sphere-morph | SPHERE MORPH | 구면 점군이 노이즈로 일그러졌다 복원 |
| TD03 | wire-terrain | WIRE TERRAIN | 와이어프레임 지형 위 무한 활공 |
| TD04 | knot-family | KNOT FAMILY | 토러스 매듭 (p,q) 파라미터 순회 회전 |
| TD05 | lorenz-ribbon | LORENZ RIBBON | 로렌츠 끌개를 3D 리본으로 추적 |
| TD06 | box-city | BOX CITY | 자라나고 무너지는 절차적 박스 도시 |
| TD07 | orbit-ribbons | ORBIT RIBBONS | 궤도면이 세차운동하는 3D 리본들 |
| TD08 | point-galaxy | POINT GALAXY | 수만 점 파티클 나선 은하의 회전 |
| TD09 | icosa-breath | ICOSA BREATH | 정점 변위로 숨쉬는 이코사헤드론 |
| TD10 | grid-tunnel | GRID TUNNEL | 무한히 빨려 들어가는 그리드 터널 |

## SHADER — GLSL 프래그먼트 (`shader`, three + shaderQuad)

| ID | slug | title | 설명 |
|---|---|---|---|
| SH01 ★ | plasma-core | PLASMA CORE | 고전 플라즈마 사인 간섭 |
| SH02 | raymarch-orb | RAYMARCH ORB | 레이마칭 SDF 구체·토러스의 부드러운 융합 |
| SH03 | voronoi-flux | VORONOI FLUX | 셀 중심이 유영하는 애니메이티드 보로노이 |
| SH04 | fbm-nebula | FBM NEBULA | fbm 노이즈 성운의 느린 대류 |
| SH05 | interference | INTERFERENCE | 이동 파원들의 파동 간섭 링 |
| SH06 | polar-tunnel | POLAR TUNNEL | 극좌표 변환 터널 워프 |
| SH07 | scan-grid | SCAN GRID | 계측기 스캔라인 + 글로우 그리드 |
| SH08 | kaleido-fold | KALEIDO FOLD | 만화경 접기 노이즈 |
| SH09 | sdf-morph | SDF MORPH | 원→사각→별 SDF 형태 모핑 |
| SH10 | domain-warp | DOMAIN WARP | 도메인 워핑 노이즈의 유체적 뒤틀림 |

## CHAOS — 동역학·카오스 (`chaos`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| CH01 | double-pendulum | DOUBLE PENDULUM | 이중 진자 궤적 트레일 — 미세 초기차 2벌 동시 |
| CH02 | harmonograph | HARMONOGRAPH | 감쇠 진자 하모노그래프 드로잉 |
| CH03 | dejong-veil | DEJONG VEIL | 드 종 끌개 점운의 베일 |
| CH04 | clifford-smoke | CLIFFORD SMOKE | 클리퍼드 끌개 연기 — 파라미터 서서히 이동 |
| CH05 | hopalong-trail | HOPALONG TRAIL | 호팔롱 끌개 점 축적 |
| CH06 | spring-mesh | SPRING MESH | 주기적 충격이 퍼지는 2D 스프링 그물 |
| CH07 | three-body | THREE BODY | 평면 삼체 문제 궤적 — 발산하면 리시드 |
| CH08 | bifurcation | BIFURCATION | 로지스틱 맵 분기 다이어그램을 훑는 스캔 |
| CH09 | duffing-phase | DUFFING PHASE | 더핑 진동자 위상 궤적의 리본 |
| CH10 | epicycle-lace | EPICYCLE LACE | 정수비 공명 주전원이 짜는 레이스 |
