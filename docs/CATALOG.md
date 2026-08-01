# DEXA GEN LAB — 카탈로그 v2 (20 카테고리 × 10종 = 200)

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

## WAVE — 파동·진동 (`wave`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| WV01 | sine-weave | SINE WEAVE | 겹친 사인 곡선이 직조하듯 교차하는 파동장 |
| WV02 | standing-node | STANDING NODE | 정상파의 마디와 배가 천천히 이동하는 선형 공명 |
| WV03 | harmonic-tide | HARMONIC TIDE | 배음열이 밀물처럼 겹쳐지는 수평 파동 |
| WV04 | radial-chime | RADIAL CHIME | 원형으로 번지는 진동이 종소리처럼 간섭하는 장면 |
| WV05 | phase-cascade | PHASE CASCADE | 위상차를 가진 곡선 다발이 연쇄적으로 미끄러지는 흐름 |
| WV06 | pulse-ribbon | PULSE RIBBON | 진폭 펄스가 여러 리본을 따라 전파되는 파형 |
| WV07 | beat-mesh | BEAT MESH | 근접 주파수의 맥놀이가 격자형 파동망을 만드는 장면 |
| WV08 | echo-curve | ECHO CURVE | 한 곡선의 잔향이 시간차를 두고 반복되는 궤적 |
| WV09 | wave-packet | WAVE PACKET | 국소 파동 묶음이 화면을 가로질러 이동하는 흐름 |
| WV10 | resonance-map | RESONANCE MAP | 다중 공명 주파수가 등고선처럼 드러나는 지도 |

## OPTICS — 광학·간섭 (`optics`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| OP01 | moire-orbit | MOIRE ORBIT | 회전하는 동심 격자가 모아레 궤도를 만드는 광학 패턴 |
| OP02 | diffraction-fan | DIFFRACTION FAN | 좁은 틈을 통과한 빛처럼 펼쳐지는 회절 부채 |
| OP03 | lens-caustic | LENS CAUSTIC | 렌즈 초점선이 움직이며 만드는 유동적 코스틱 |
| OP04 | prism-grid | PRISM GRID | 기하 격자가 신호색과 강조색으로 분광되는 장면 |
| OP05 | interference-veil | INTERFERENCE VEIL | 두 파원의 간섭무늬가 얇은 막처럼 흔들리는 패턴 |
| OP06 | aperture-bloom | APERTURE BLOOM | 조리개 날이 열리고 닫히며 빛의 꽃을 만드는 장면 |
| OP07 | chroma-fringe | CHROMA FRINGE | 윤곽 주변의 색수차가 호흡하듯 벌어지는 패턴 |
| OP08 | mirror-scan | MIRROR SCAN | 대칭 축이 순회하며 반사된 선속을 스캔하는 장면 |
| OP09 | light-cone | LIGHT CONE | 움직이는 광원이 원뿔형 빛다발을 투사하는 구성 |
| OP10 | refraction-field | REFRACTION FIELD | 격자 위 굴절률 변화가 선을 휘게 만드는 광학장 |

## DATA — 데이터·계측 (`data`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| DT01 | signal-bars | SIGNAL BARS | 다중 신호 막대가 주기와 노이즈에 따라 갱신되는 계기판 |
| DT02 | pulse-matrix | PULSE MATRIX | 데이터 셀의 펄스가 행과 열을 따라 이동하는 매트릭스 |
| DT03 | orbit-ledger | ORBIT LEDGER | 회전 데이터 포인트와 누적값을 함께 표시하는 원형 장부 |
| DT04 | stream-plot | STREAM PLOT | 여러 시계열이 스트리밍되며 교차하는 실시간 플롯 |
| DT05 | radial-index | RADIAL INDEX | 방사형 인덱스 바가 신호 세기를 순환 표시하는 장면 |
| DT06 | packet-rain | PACKET RAIN | 데이터 패킷이 열 단위로 낙하하고 누적되는 흐름 |
| DT07 | heatmap-drift | HEATMAP DRIFT | 노이즈 기반 열지도가 천천히 이동하는 데이터 표면 |
| DT08 | ticker-field | TICKER FIELD | 수치 티커가 격자 안에서 서로 다른 속도로 흐르는 장면 |
| DT09 | vector-scope | VECTOR SCOPE | 두 신호의 상관관계를 벡터 궤적으로 표시하는 스코프 |
| DT10 | cluster-pulse | CLUSTER PULSE | 군집 데이터가 중심별로 수축하고 확장하는 산점도 |

## SYSTEM — 시스템·네트워크 (`system`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| SY01 | queue-flow | QUEUE FLOW | 대기열의 항목이 처리 노드를 거쳐 이동하는 시스템 흐름 |
| SY02 | node-gossip | NODE GOSSIP | 노드 사이 소문 전파가 망 전체로 번지는 네트워크 |
| SY03 | state-orbit | STATE ORBIT | 상태 노드들이 순환 전이를 반복하는 유한상태 궤도 |
| SY04 | feedback-gate | FEEDBACK GATE | 출력이 입력으로 돌아오며 증폭과 감쇠를 반복하는 루프 |
| SY05 | swarm-consensus | SWARM CONSENSUS | 분산 노드들이 공통 위상으로 수렴하는 합의 과정 |
| SY06 | traffic-loop | TRAFFIC LOOP | 순환 경로의 토큰이 병목과 해소를 반복하는 교통계 |
| SY07 | memory-trace | MEMORY TRACE | 최근 경로가 잔상으로 남는 상태 기억 네트워크 |
| SY08 | signal-router | SIGNAL ROUTER | 입력 신호가 규칙에 따라 여러 출력으로 분기되는 라우터 |
| SY09 | cascade-lock | CASCADE LOCK | 연쇄 노드가 임계점을 넘어 순차적으로 잠기는 과정 |
| SY10 | phase-network | PHASE NETWORK | 연결된 진동자들이 위상을 교환하는 동적 그래프 |

## KINETIC — 기계 운동 (`kinetic`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| KN01 | crank-array | CRANK ARRAY | 위상차를 둔 크랭크 배열이 왕복운동을 만드는 장치 |
| KN02 | pendulum-bank | PENDULUM BANK | 길이가 다른 진자들이 파동처럼 정렬되는 진자열 |
| KN03 | gear-bloom | GEAR BLOOM | 맞물린 기어가 꽃잎처럼 회전하는 기계적 개화 |
| KN04 | cam-follower | CAM FOLLOWER | 회전 캠의 윤곽을 따라 종동자가 오르내리는 장치 |
| KN05 | linkage-wave | LINKAGE WAVE | 사절 링크 연쇄가 물결 모양 운동을 전달하는 구조 |
| KN06 | rotor-field | ROTOR FIELD | 다중 로터의 회전 위상이 장 전체에 흐르는 배열 |
| KN07 | balance-chain | BALANCE CHAIN | 연결된 균형추가 힘을 주고받으며 흔들리는 체인 |
| KN08 | piston-rhythm | PISTON RHYTHM | 피스톤 열이 서로 다른 박자로 왕복하는 엔진 리듬 |
| KN09 | escapement | ESCAPEMENT | 톱니와 팔레트가 간헐적으로 맞물리는 시계 탈진기 |
| KN10 | kinetic-loom | KINETIC LOOM | 기계 링크가 직조 운동을 반복하는 키네틱 직기 |

## TEXTILE — 직물·패턴 (`textile`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| TL01 | warp-weft | WARP WEFT | 날실과 씨실이 교대로 위아래를 지나는 기본 직조 |
| TL02 | basket-shift | BASKET SHIFT | 두 올씩 묶인 바스켓 조직이 위상 이동하는 패턴 |
| TL03 | satin-wave | SATIN WAVE | 긴 부유사가 물결처럼 번지는 새틴 조직 |
| TL04 | twill-drift | TWILL DRIFT | 사선 능직선이 천천히 화면을 가로지르는 직물 |
| TL05 | knot-grid | KNOT GRID | 격자 교차점의 매듭이 순차적으로 조여지는 패턴 |
| TL06 | plaid-pulse | PLAID PULSE | 굵기 다른 띠가 펄스하며 변주되는 체크 직물 |
| TL07 | braid-field | BRAID FIELD | 세 가닥 곡선이 반복적으로 교차하는 땋기 장 |
| TL08 | jacquard-noise | JACQUARD NOISE | 노이즈 마스크가 복잡한 자카드 무늬를 갱신하는 직조 |
| TL09 | lace-cell | LACE CELL | 빈 공간과 연결선이 반복되는 레이스 셀 구조 |
| TL10 | fiber-current | FIBER CURRENT | 섬유 다발이 유체 흐름처럼 휘어지는 직물 표면 |

## FLUID — 유체·흐름 (`fluid`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| FL01 | ink-advection | INK ADVECTION | 잉크 입자가 노이즈 유동장에 실려 번지는 흐름 |
| FL02 | vortex-dye | VORTEX DYE | 염료 입자가 회전 소용돌이에 감겨드는 유체 궤적 |
| FL03 | smoke-plume | SMOKE PLUME | 부력과 난류를 따라 상승하는 연기 기둥 |
| FL04 | laminar-fold | LAMINAR FOLD | 층류 띠가 반복적으로 접히며 얇아지는 흐름 |
| FL05 | bubble-current | BUBBLE CURRENT | 기포 군집이 상승류와 횡류에 흔들리는 장면 |
| FL06 | oil-slick | OIL SLICK | 얇은 막의 간섭색 같은 곡선이 유영하는 표면 |
| FL07 | ripple-basin | RIPPLE BASIN | 여러 낙하점의 원형 파문이 수면에서 간섭하는 장면 |
| FL08 | thermal-column | THERMAL COLUMN | 가열된 유체가 기둥을 이루며 상승하고 분기하는 흐름 |
| FL09 | tide-pool | TIDE POOL | 경계 안의 완만한 조류가 입자를 순환시키는 작은 수조 |
| FL10 | capillary-web | CAPILLARY WEB | 가는 유체 선이 표면장력처럼 연결되는 모세관 망 |

## MINIMAL — 절제된 운동 (`minimal`, p5)

| ID | slug | title | 설명 |
|---|---|---|---|
| MN01 | single-orbit | SINGLE ORBIT | 하나의 점과 궤도만으로 구성한 느린 회전 |
| MN02 | breathing-line | BREATHING LINE | 한 줄의 길이와 곡률이 호흡하듯 변하는 구성 |
| MN03 | quiet-grid | QUIET GRID | 성긴 격자의 한 지점만 이동하는 절제된 장면 |
| MN04 | offset-circle | OFFSET CIRCLE | 중심에서 비껴난 원들이 미세하게 정렬되는 운동 |
| MN05 | two-body | TWO BODY | 두 형태가 거리와 크기를 교환하는 최소 역학 |
| MN06 | interval-field | INTERVAL FIELD | 간격이 천천히 이동하는 수직선의 장 |
| MN07 | silent-pulse | SILENT PULSE | 단일 사각형의 밝기와 크기만 변화하는 펄스 |
| MN08 | narrow-wave | NARROW WAVE | 가느다란 파형 하나가 화면을 천천히 횡단하는 구성 |
| MN09 | hinge-point | HINGE POINT | 한 축을 중심으로 두 선분이 접히고 펴지는 운동 |
| MN10 | slow-divider | SLOW DIVIDER | 화면을 나누는 경계선이 완만히 이동하는 장면 |

## TOPOLOGY — 3D 위상·매듭 (`topology`, three)

| ID | slug | title | 설명 |
|---|---|---|---|
| TP01 | torus-flow | TORUS FLOW | 토러스 표면을 따라 흐르는 다중 폐곡선 |
| TP02 | mobius-band | MOBIUS BAND | 한 번 비틀린 띠를 연상시키는 연속 궤적 |
| TP03 | klein-shadow | KLEIN SHADOW | 클라인 병의 자기교차를 암시하는 와이어 구조 |
| TP04 | linked-rings | LINKED RINGS | 서로 관통하며 회전하는 연결 고리 군집 |
| TP05 | trefoil-trace | TREFOIL TRACE | 삼엽 매듭을 따라 흐르는 발광 궤적 |
| TP06 | genus-shift | GENUS SHIFT | 구멍 수가 변하는 듯 호흡하는 위상 표면 |
| TP07 | braided-loop | BRAIDED LOOP | 여러 폐곡선이 땋이듯 교차하는 3D 루프 |
| TP08 | knot-surface | KNOT SURFACE | 토러스 매듭과 궤도선이 만드는 복합 표면 |
| TP09 | orbital-link | ORBITAL LINK | 서로 다른 평면의 궤도가 위상적으로 연결된 구조 |
| TP10 | topology-cage | TOPOLOGY CAGE | 다중 매듭선이 회전하며 만드는 투명 케이지 |

## COSMIC — 3D 우주 (`cosmic`, three)

| ID | slug | title | 설명 |
|---|---|---|---|
| CS01 | star-forge | STAR FORGE | 고밀도 별점이 중심 원반에서 탄생하는 항성 공장 |
| CS02 | nebula-shell | NEBULA SHELL | 성운 입자가 구각을 따라 호흡하는 우주 껍질 |
| CS03 | pulsar-beam | PULSAR BEAM | 회전 천체의 두 광선이 공간을 주기적으로 스캔 |
| CS04 | comet-swarm | COMET SWARM | 꼬리를 가진 입자 무리가 중심 천체를 스쳐가는 장면 |
| CS05 | dark-orbit | DARK ORBIT | 어두운 중심체 주변으로 빛점이 휘어지는 궤도 |
| CS06 | cluster-lens | CLUSTER LENS | 성단 중심의 중력렌즈를 암시하는 휘어진 별 고리 |
| CS07 | solar-flare | SOLAR FLARE | 항성 표면에서 호 형태 플레어가 솟는 장면 |
| CS08 | asteroid-belt | ASTEROID BELT | 크기가 다른 암석 입자가 띠를 이루며 공전 |
| CS09 | cosmic-web | COSMIC WEB | 별점과 연결선이 대규모 우주망을 만드는 구조 |
| CS10 | event-horizon | EVENT HORIZON | 빛의 원반과 입자가 사건의 지평선 주변을 회전 |
