# DEXA GEN LAB — 카탈로그 v3 (20 카테고리 × 25종 = 500)

v3 확장(ID 11~25)은 문서 하단 "확장 v3" 섹션 참조. **근접 이웃 게이트**: 모든 신규 항목은 기존 카탈로그에서 가장 유사한 ID와 차별점을 명시해야 하며, 같은 알고리즘의 파라미터 변형으로 개수를 채우는 것은 반려한다.

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

---

# 확장 v3 (ID 11~25, +300)

모든 행은 `근접·차별` 컬럼 필수 — 가장 유사한 기존 ID와, 알고리즘 차원의 차별점. 파라미터만 다른 변형은 반려 대상.

## FIELD 확장 v3 (`field`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| FD11 | ridge-lines | RIDGE LINES | 능선(ridged) 노이즈 골짜기에 침식 선이 새겨지는 지형 | FD07 등고선 추종이 아니라 절댓값 능선장의 침식 골 추적 |
| FD12 | orbit-field | ORBIT FIELD | 다중 회전 중심의 순환 궤도를 도는 입자들 | FD05 중력 궤적과 달리 발산 없는 폐궤도 회전장 |
| FD13 | shear-bands | SHEAR BANDS | 층별로 반대 방향 전단 흐름이 미끄러지는 수평 띠 | FD08 보텍스가 아니라 수평 층간 역방향 전단 |
| FD14 | noise-comb | NOISE COMB | 빗살 선분 전체가 장 방향으로 일제히 휘어지는 격자 | FD09 바늘 지시가 아니라 빗살의 소성 굽힘 변형 |
| FD15 | sink-source | SINK SOURCE | 샘(발산)과 배수구(수렴) 쌍이 명멸하는 장 | FD05 인력 우물이 아니라 발산·수렴 쌍극 생멸 |
| FD16 | helix-stream | HELIX STREAM | 3D 나선 유선을 평면에 투영한 감김 흐름 | FD02 평면 컬이 아니라 나선 투영의 깊이 감김 |
| FD17 | tangent-web | TANGENT WEB | 등고선 접선 현(chord)들이 짜는 직조망 | FD07 등고선 자체가 아니라 접선 현의 직조 |
| FD18 | pulse-front | PULSE FRONT | 장을 가로지르는 파면이 입자를 일제히 밀어내는 웨이브 | FD10 개별 생멸이 아니라 파면 통과 일제 가진 |
| FD19 | braided-flow | BRAIDED FLOW | 두 노이즈 장의 지배권이 교대해 유선이 땋이는 흐름 | FD02 단일 장이 아니라 이중 장 교대 땋임 |
| FD20 | field-erosion | FIELD EROSION | 통행량이 장을 침식해 물길이 패이는 피드백 흐름 | FD01 정적 장이 아니라 궤적이 장을 깎는 피드백 |
| FD21 | compass-drift | COMPASS DRIFT | 나침반 바늘 격자가 관성·지연으로 떠도는 극을 추적 | FD09 즉시 지시가 아니라 관성 지연 추적 동역학 |
| FD22 | jet-stream | JET STREAM | 사행하는 고속 제트 코어와 주변 저속류의 대비 | FD04 리본 다발이 아니라 단일 제트의 사행·속도 대비 |
| FD23 | quiver-bloom | QUIVER BLOOM | 중심에서 방사되는 화살 다발이 개화하듯 회전 | FD06 간섭 격자가 아니라 방사 다발의 개화 위상 |
| FD24 | laminar-split | LAMINAR SPLIT | 장애물 정체점에서 갈라져 재합류하는 층류 선 | FD08 후류 보텍스가 아니라 전방 분기·재합류 층류 |
| FD25 | memory-field | MEMORY FIELD | 입자 궤적이 장의 방향을 재기록하는 강화 피드백 | FD20 침식(깎임)이 아니라 방향 덧씀(강화) 피드백 |

## PARTICLE 확장 v3 (`particle`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| PT11 | gravity-dance | GRAVITY DANCE | 상호 인력 N-body 입자들의 군무 | PT01 고정 중심이 아니라 입자간 상호 인력 |
| PT12 | orbit-decay | ORBIT DECAY | 감쇠 나선으로 낙하해 삼켜지고 재방출되는 입자 | PT01 안정 궤도가 아니라 감쇠 낙하·재방출 순환 |
| PT13 | swarm-hunt | SWARM HUNT | 표적을 쫓는 무리와 회피하는 표적의 추격전 | PT02 동종 플로킹이 아니라 추격자·도망자 비대칭 |
| PT14 | lattice-melt | LATTICE MELT | 결정 격자가 녹았다 재결정되는 상전이 순환 | PT05 복귀 격자가 아니라 온도 순환 상전이 |
| PT15 | fountain-arc | FOUNTAIN ARC | 발사-포물선-회수로 순환하는 분수 입자 아치 | PT09 낙하-튀김이 아니라 발사·회수 순환 아치 |
| PT16 | static-cling | STATIC CLING | 벽면에 흡착했다 박리되는 정전기 입자들 | PT05 반발 회피가 아니라 흡착·박리 사이클 |
| PT17 | drift-nets | DRIFT NETS | 근접 거리에서 연결선이 생멸하는 부유 네트워크 | PT03 점멸 동기화가 아니라 근접 링크 생멸망 |
| PT18 | pressure-pack | PRESSURE PACK | 수축하는 경계 안에서 압축·방출되는 입자 밀도파 | PT07 자유 기체가 아니라 가변 경계 압축 밀도파 |
| PT19 | relay-pulse | RELAY PULSE | 입자 사이를 릴레이로 건너뛰는 펄스 신호 | PT17 정적 근접망이 아니라 신호의 릴레이 점프 |
| PT20 | brownian-ink | BROWNIAN INK | 브라운 보행 입자가 남기는 잉크 얼룩 축적 | PT07 탄성 충돌이 아니라 무작위 보행 번짐 |
| PT21 | shell-orbits | SHELL ORBITS | 동심 껍질별로 각속도가 다른 입자 궤도층 | PT01 단일 무리가 아니라 껍질별 차등 회전 |
| PT22 | wind-chaff | WIND CHAFF | 돌풍 이벤트에 휩쓸렸다 가라앉는 겨 입자들 | PT09 연속 낙하가 아니라 돌풍 이벤트 부유·침강 |
| PT23 | magnet-duel | MAGNET DUEL | 이동하는 두 자극이 입자를 쟁탈하는 대결 | PT10 종간 규칙이 아니라 이동 자극의 영역 쟁탈 |
| PT24 | crystal-seed | CRYSTAL SEED | 씨앗에 흡착해 격자 정렬로 자라는 결정 | CA08 무작위 응집이 아니라 격자 정렬 결정 성장 |
| PT25 | phase-swap | PHASE SWAP | 두 군집이 위상을 교환하며 자리를 바꾸는 안무 | PT10 경계 무늬가 아니라 군집 자리바꿈 안무 |

## GEOMETRY 확장 v3 (`geometry`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| GM11 | rose-window | ROSE WINDOW | 방사 대칭 장미창 격자의 개폐 회전 | GM07 격자 펄스가 아니라 방사 대칭 개폐 |
| GM12 | diamond-drift | DIAMOND DRIFT | 마름모 격자가 대각으로 활주하며 위상 변조 | GM01 타일 회전이 아니라 격자 전체 대각 활주 |
| GM13 | tri-subdiv | TRI SUBDIV | 삼각형 재귀 분할이 파도 순서로 갱신 | GM08 사각 분할이 아니라 삼각 재귀+파도 갱신 |
| GM14 | ring-stack | RING STACK | 두께가 다른 링들이 적층·산개하는 동심 리듬 | GM09 곡선 가족이 아니라 링의 적층·산개 |
| GM15 | star-polygon | STAR POLYGON | 별 다각형 {n/k}의 k 파라미터 순회 | GM05 변 수 보간이 아니라 {n/k} 위상 순회 |
| GM16 | offset-maze | OFFSET MAZE | 직교 통로가 오프셋 위상으로 흐르는 미로풍 패턴 | GM06 백트래커 탐색이 아니라 통로 위상 이동 |
| GM17 | chord-fan | CHORD FAN | 원둘레 점을 잇는 현들이 부채처럼 전개 | GM10 원호 모아레가 아니라 현의 부채 전개 |
| GM18 | tile-flip | TILE FLIP | 격자 타일이 이산 플립으로 뒤집히는 체커 웨이브 | GM01 연속 회전이 아니라 이산 플립 전파 |
| GM19 | nested-frames | NESTED FRAMES | 중첩 사각 프레임이 회전·수축하는 줌 터널 | GM04 등축 파동이 아니라 중첩 프레임 줌 |
| GM20 | golden-fan | GOLDEN FAN | 황금각 회전으로 배치되는 부채살 전개 | OR10 씨앗 점 배열이 아니라 부채살 기하 전개 |
| GM21 | grid-shear | GRID SHEAR | 격자가 국소 전단 렌즈를 통과하며 왜곡 | GM12 전체 활주가 아니라 국소 전단 왜곡 |
| GM22 | arc-clock | ARC CLOCK | 서로 다른 주기의 원호 게이지가 도는 기하 문자판 | DT05 데이터 게이지가 아니라 순수 주기 기하 |
| GM23 | poly-orbit | POLY ORBIT | 다각형 꼭짓점이 서로의 변 위를 도는 연쇄 | GM05 형태 보간이 아니라 꼭짓점 변 위 궤도 |
| GM24 | hatch-field | HATCH FIELD | 해칭 선 각도가 영역별로 회전하는 판화풍 장 | GM10 원호 격자가 아니라 직선 해칭 각도장 |
| GM25 | lattice-breath | LATTICE BREATH | 격자 간격이 중심에서 호흡하듯 팽창·수축 | GM07 펄스 전파가 아니라 간격 자체의 호흡 |

## FRACTAL 확장 v3 (`fractal`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| FR11 | pythagoras-tree | PYTHAGORAS TREE | 사각형 적층 피타고라스 나무의 기울기 성장 | FR08 가지 선분이 아니라 사각형 적층 트리 |
| FR12 | cantor-rain | CANTOR RAIN | 칸토어 집합 세대가 층층이 내려앉는 적층 | FR10 경로 주행이 아니라 절단 집합 낙하 적층 |
| FR13 | sierpinski-fold | SIERPINSKI FOLD | 시에르핀스키 삼각형의 세대 접기 모핑 | FR06 점 축적이 아니라 도형 세대 접기 |
| FR14 | burning-ship | BURNING SHIP | 버닝십 프랙탈 경계의 느린 표류 (저해상 버퍼) | FR04 만델브로트가 아니라 절댓값 변형 집합 |
| FR15 | newton-basin | NEWTON BASIN | 뉴턴 방법 수렴 유역 경계의 회전 (저해상 버퍼) | FR05 탈출 시간이 아니라 근 수렴 유역 |
| FR16 | levy-curve | LEVY CURVE | 레비 C 커브의 45° 복제 성장 | FR03 드래곤 접기가 아니라 레비 복제 규칙 |
| FR17 | tree-spiral | TREE SPIRAL | 나선 감김 규칙의 재귀 가지 소용돌이 | FR08 바람 흔들림이 아니라 나선 감김 수형 |
| FR18 | plasma-diamond | PLASMA DIAMOND | 다이아몬드-스퀘어 고도장의 등고 흐름 (저해상) | CA03 반응확산이 아니라 분할 고도장 등고 |
| FR19 | ifs-swarm | IFS SWARM | 계수 공간을 유영하는 가변 IFS 점운 | FR07 고정 IFS가 아니라 계수 유영 변형 |
| FR20 | gosper-walk | GOSPER WALK | 육각 고스퍼 곡선을 걷는 다중 트레이서 | FR10 힐베르트 단일 헤드가 아니라 육각+다중 |
| FR21 | branch-lightning | BRANCH LIGHTNING | 재귀 분기 번개의 방전과 잔광 감쇠 순환 | FR08 성장 수형이 아니라 순간 방전·잔광 |
| FR22 | box-fractal | BOX FRACTAL | 비체크 박스 프랙탈 세대의 소거 명멸 | FR13 삼각 접기가 아니라 박스 소거 세대 |
| FR23 | minkowski-coast | MINKOWSKI COAST | 민코프스키 소시지 해안선의 굽이 변형 | FR02 눈송이 폐곡선이 아니라 직각 해안선 |
| FR24 | recursive-rings | RECURSIVE RINGS | 둘레 배치 고리들의 재귀 자전·공전 | FR09 내접 중첩이 아니라 둘레 배치 공전 |
| FR25 | fractal-dust | FRACTAL DUST | 다층 스케일 점 먼지의 자기유사 순환 줌 | FR06 꼭짓점 규칙이 아니라 다층 스케일 줌 |

## AUTOMATA 확장 v3 (`automata`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| CA11 | wireworld | WIREWORLD | 와이어월드 회로 위를 달리는 전자 신호 | CA01 생사 규칙이 아니라 도체·전자 회로 신호 |
| CA12 | seeds-burst | SEEDS BURST | 생존 없는 Seeds(B2) 규칙의 폭발적 명멸 | CA01 생존 규칙이 아니라 전멸·폭발 명멸 |
| CA13 | day-night | DAY NIGHT | Day&Night 반전 대칭 규칙의 흑백 영토 성장 | CA01 비대칭 생사가 아니라 반전 대칭 규칙 |
| CA14 | maze-rule | MAZE RULE | 미로 조직을 짜는 Maze 계열 규칙 성장 | CA01 산발 패턴이 아니라 통로 조직 형성 |
| CA15 | hodgepodge | HODGEPODGE | 호지포지 머신의 감염·회복 나선 파동 | CA07 이산 순환이 아니라 연속값 감염 나선 |
| CA16 | turmite | TURMITE | 다상태 튜링 개미가 새기는 기하 문양 | CA05 단일 규칙 개미가 아니라 다상태 터마이트 |
| CA17 | life-soup | LIFE SOUP | 글라이더·진동자를 채집 강조하는 생명 수프 | CA01 전체 리시드가 아니라 패턴 검출 하이라이트 |
| CA18 | totalistic-tide | TOTALISTIC TIDE | 3색 총계 규칙 CA가 조수처럼 스크롤 | CA02 2색 기본 규칙이 아니라 3색 총계 규칙 |
| CA19 | greenberg | GREENBERG | 그린버그-헤이스팅스 흥분·불응 고리 파 | CA06 3상태 발화가 아니라 흥분매질 고리파 |
| CA20 | lattice-gas | LATTICE GAS | HPP 격자 기체의 충돌·반사 확산 | CA04 토플링이 아니라 운동량 보존 격자 기체 |
| CA21 | ising-flux | ISING FLUX | 온도 순환에 따라 자화·해체되는 이징 스핀 | CA09 다수결이 아니라 온도 확률 스핀 동역학 |
| CA22 | voter-patch | VOTER PATCH | 유권자 모형 영토 경계의 표류·합병 | CA09 침식 수렴이 아니라 경계 표류·합병 |
| CA23 | snow-crystal | SNOW CRYSTAL | 육각 대칭 규칙으로 자라는 눈결정 | CA08 무작위 응집이 아니라 육각 대칭 성장 |
| CA24 | percolation | PERCOLATION | 점유율 스윕이 임계 관통하는 스미기 순간 | CA10 발화 순환이 아니라 임계 클러스터 관통 |
| CA25 | ant-colony | ANT COLONY | 페로몬 증발·강화로 경로를 찾는 개미 군집 | CA05 규칙 개미가 아니라 페로몬 최적화 군집 |

## ORGANIC 확장 v3 (`organic`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| OR11 | tendril-climb | TENDRIL CLIMB | 덩굴손이 지지대를 나선으로 감아 오르는 성장 | OR07 지향 하강이 아니라 나선 권선 상승 |
| OR12 | spore-burst | SPORE BURST | 포자낭 파열·산포·발아의 세대 순환 | OR04 경계 확산이 아니라 파열·발아 순환 |
| OR13 | reef-layers | REEF LAYERS | 단면에 층층이 퇴적되는 산호초 성장 기록 | OR08 표면 성장이 아니라 단면 퇴적층 누적 |
| OR14 | amoeba-flow | AMOEBA FLOW | 위족을 뻗어 이동하는 아메바 막의 유동 | OR06 분열이 아니라 위족 신축 이동 |
| OR15 | leaf-unfurl | LEAF UNFURL | 말린 잎이 펼쳐졌다 시들어 감기는 곡률 순환 | OR05 흔들림이 아니라 말림·펼침 곡률 변형 |
| OR16 | barnacle-field | BARNACLE FIELD | 고착 따개비 군락의 촉수 개폐 리듬 | OR05 줄기 요동이 아니라 고착 개체 개폐 |
| OR17 | slime-network | SLIME NETWORK | 점균이 먹이점 사이 최단망을 강화·소멸시키는 탐색 | OR09 무목적 분기가 아니라 먹이망 최적화 |
| OR18 | feather-vane | FEATHER VANE | 축 대칭으로 결을 이루는 깃가지 깃털 | OR02 식민화 분기가 아니라 축 대칭 깃가지 결 |
| OR19 | pollen-drift | POLLEN DRIFT | 관성 있는 꽃가루가 바람길을 떠도는 부유·착지 | FD10 유선 생멸이 아니라 관성 입자 부유·착지 |
| OR20 | bark-crack | BARK CRACK | 성장 응력으로 갈라지는 수피 균열 전파 | GM08 기하 분할이 아니라 응력 기반 유기 균열 |
| OR21 | anemone-sway | ANEMONE SWAY | 유체에 결합된 말미잘 촉수 다발의 연속 파동 | OR16 개폐 리듬이 아니라 촉수 연속 파동 군무 |
| OR22 | seed-scatter | SEED SCATTER | 탄도 산포된 씨앗이 착지해 새 개체로 발아 | OR12 포자 구름이 아니라 탄도 산포·개체 성장 |
| OR23 | gill-fold | GILL FOLD | 버섯 주름살이 방사형으로 접히는 곡면 리듬 | OR10 점 배열이 아니라 방사 주름 접힘 곡면 |
| OR24 | vine-lattice | VINE LATTICE | 덩굴이 격자를 타고 얽히는 피복 성장 | OR11 단독 권선이 아니라 격자 피복·상호 얽힘 |
| OR25 | plankton-bloom | PLANKTON BLOOM | 소용돌이 유동에 실린 플랑크톤의 대증식·소멸 | PT08 중력 원반이 아니라 유동 결합 개체군 동역학 |

## GLYPH 확장 v3 (`glyph`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| TX11 | hex-dump | HEX DUMP | 16진 메모리 뷰가 국소 갱신·하이라이트되는 덤프 | TX07 숫자 롤링이 아니라 국소 갱신 메모리 뷰 |
| TX12 | semaphore | SEMAPHORE | 수기 신호 깃발 각도로 메시지를 전하는 격자 | TX05 시간 부호가 아니라 각도 부호 깃발 |
| TX13 | typewriter-loop | TYPEWRITER LOOP | 타건·캐리지 리턴·지움을 반복하는 타자기 | TX02 입자 응집이 아니라 순차 타건 루프 |
| TX14 | stencil-scan | STENCIL SCAN | 스텐실 글자 마스크 위를 훑는 광선 스캔 | TX03 도트 웨이브가 아니라 마스크 광선 스캔 |
| TX15 | glyph-orbit | GLYPH ORBIT | 궤도를 돌던 문자들이 정렬되는 순간의 포착 | TX02 산포·응집이 아니라 궤도 운동 중 정렬 |
| TX16 | flipboard | FLIPBOARD | 공항 플립보드 카드가 차르르 넘어가는 판 | TX07 연속 롤링이 아니라 이산 플립 파도 |
| TX17 | ascii-tunnel | ASCII TUNNEL | 문자 계조로 그린 원근 터널 비행 | TX01 평면 조수가 아니라 원근 터널 계조 |
| TX18 | rune-cycle | RUNE CYCLE | 기하 룬 문자가 획 순서대로 새겨지는 원환 | TX09 무작위 변이가 아니라 획순 스트로크 드로잉 |
| TX19 | crossword-pulse | CROSSWORD PULSE | 낱말판 칸이 연쇄적으로 채워지고 비워지는 리듬 | TX08 천공 갱신이 아니라 낱말 연쇄 채움 |
| TX20 | ticker-tape | TICKER TAPE | 다층 티커 띠가 서로 다른 속도로 흐르는 층 | TX07 수직 롤링이 아니라 수평 다층 티커 |
| TX21 | seven-segment | SEVEN SEGMENT | 7세그먼트 획이 분해·재조합되는 디스플레이 | TX07 활자 롤링이 아니라 세그먼트 획 분해 |
| TX22 | caret-swarm | CARET SWARM | 편집 커서 무리가 문서를 몰려다니며 고치는 장면 | PT02 새 떼가 아니라 문서 편집 행위 군집 |
| TX23 | glyph-gravity | GLYPH GRAVITY | 문자들이 낙하·충돌해 바닥에 쌓이는 활자 더미 | TX02 응집 순환이 아니라 낙하·적층 물리 |
| TX24 | wave-text | WAVE TEXT | 문장 베이스라인이 파도를 타고 굽이치는 타이포 | TX01 계조 렌더가 아니라 베이스라인 변형 |
| TX25 | redaction | REDACTION | 검열 막대가 자라며 텍스트를 가리고 해제하는 리듬 | TX13 타건이 아니라 막대 성장·해제 리듬 |

## SPACE 확장 v3 (`space`, three)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| TD11 | ring-planet | RING PLANET | 고리 파편이 케플러 공전하는 행성계 | TD08 은하 원반이 아니라 행성+고리 궤도 역학 |
| TD12 | voxel-wave | VOXEL WAVE | 3D 복셀 부피를 통과하는 밀도 파동 | TD01 높이 스케일이 아니라 부피 통과 파동 |
| TD13 | satellite-web | SATELLITE WEB | 궤도 위성들이 가시선 링크로 연결되는 망 | TD07 리본 궤적이 아니라 위성점+링크 생멸 |
| TD14 | spiral-stair | SPIRAL STAIR | 무한 상승하는 나선 계단의 착시 루프 | TD10 전진 터널이 아니라 상승 나선 착시 |
| TD15 | wire-forest | WIRE FOREST | 와이어 수형 군락 사이를 활강하는 절차적 숲 | TD03 지형면이 아니라 수직 수형 군락 |
| TD16 | orbit-gyro | ORBIT GYRO | 다축 링이 세차 운동하는 기계 천구 | TD04 매듭 곡선이 아니라 다축 링 세차 |
| TD17 | point-cloth | POINT CLOTH | 점군 천이 바람에 펄럭이는 3D 직물 시뮬 | TD02 구면 노이즈가 아니라 평면 천 물리 |
| TD18 | shard-storm | SHARD STORM | 파편 회오리가 형태를 이뤘다 흩어지는 폭풍 | TD06 정적 성장이 아니라 파편 형성·붕괴 |
| TD19 | helix-dna | HELIX DNA | 가로대를 가진 이중 나선의 회전 상승 | TD14 계단 착시가 아니라 이중 나선 구조 |
| TD20 | monolith-field | MONOLITH FIELD | 석판 군이 정렬을 전환하는 평원의 안무 | TD06 도시 성장이 아니라 석판 정렬 전환 |
| TD21 | sphere-shells | SPHERE SHELLS | 동심 구각 점군이 역방향으로 자전하는 겹침 | TD02 단일 구면이 아니라 동심 껍질 역회전 |
| TD22 | ribbon-canyon | RIBBON CANYON | 다층 리본 지층 협곡 사이의 활공 | TD03 단일 지형이 아니라 다층 리본 지층 |
| TD23 | arc-reactor | ARC REACTOR | 동심 아크 링이 맥동 점화되는 코어 | TD16 세차 링이 아니라 동심 아크 맥동 |
| TD24 | net-sphere | NET SPHERE | 측지 그물 구가 위상 반전으로 뒤집히는 구조 | TD09 정점 변위가 아니라 측지망 위상 반전 |
| TD25 | drift-blocks | DRIFT BLOCKS | 무중력 블록들이 도킹·분리를 반복하는 군집 | TD06 지상 도시가 아니라 무중력 도킹 군집 |

## SHADER 확장 v3 (`shader`, three + shaderQuad)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| SH11 | hex-flow | HEX FLOW | 정육각 타일 격자 장의 규칙적 흐름 | SH03 불규칙 셀이 아니라 정육각 규칙 격자 |
| SH12 | metaball-pool | METABALL POOL | 다중 SDF 블롭이 융합·분리되는 메타볼 풀 | SH09 단일 형태 모핑이 아니라 다중 블롭 융합 |
| SH13 | moire-rings | MOIRE RINGS | 링 격자끼리 만드는 기하 모아레 간섭 | SH05 파동 간섭이 아니라 격자 기하 모아레 |
| SH14 | star-burst | STAR BURST | 방사 광선이 회전하는 성광 폭발 | SH07 격자 스캔이 아니라 방사 광선 회전 |
| SH15 | liquid-metal | LIQUID METAL | 노멀 기반 하이라이트가 흐르는 액체 금속 | SH10 색 계조 워핑이 아니라 스펙큘러 하이라이트 |
| SH16 | circuit-trace | CIRCUIT TRACE | 회로 트레이스를 따라 달리는 신호 펄스 | SH07 균질 그리드가 아니라 회로 경로 주행 |
| SH17 | glitch-scan | GLITCH SCAN | 슬라이스 오프셋이 파열하는 스캔 글리치 | SH07 안정 스캔이 아니라 슬라이스 파열 |
| SH18 | caustic-floor | CAUSTIC FLOOR | 수면 굴절이 바닥에 드리우는 코스틱 그물 | SH04 대류 구름이 아니라 굴절 코스틱 그물 |
| SH19 | aurora-veil | AURORA VEIL | 수직 커튼 리본이 흐르는 오로라 장막 | SH04 부피 성운이 아니라 수직 커튼 리본 |
| SH20 | sdf-city | SDF CITY | 공간 반복 SDF 스카이라인의 무한 행진 | SH02 단일 오브젝트가 아니라 공간 반복 도시 |
| SH21 | noise-marble | NOISE MARBLE | 결이 고운 대리석 줄무늬의 느린 유동 | SH10 유체 뒤틀림이 아니라 줄무늬 결 유동 |
| SH22 | signal-scope | SIGNAL SCOPE | 발광 파형이 잔광을 남기는 오실로스코프 | DT09 p5 계측이 아니라 GLSL 발광 잔광 파형 |
| SH23 | kali-fold | KALI FOLD | 역수 반복 칼리셋 접기 프랙탈 | SH08 각도 접기가 아니라 역수 반복 칼리셋 |
| SH24 | cloud-march | CLOUD MARCH | 밀도 적분 볼륨 구름의 느린 이류 | SH02 표면 SDF가 아니라 밀도 볼륨 적분 |
| SH25 | pixel-sort | PIXEL SORT | 밝기 정렬 스트릭이 흐르는 픽셀 소트 | SH17 슬라이스 어긋남이 아니라 밝기 정렬 스트릭 |

## CHAOS 확장 v3 (`chaos`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| CH11 | rossler-band | ROSSLER BAND | 뢰슬러 끌개 단일 두루마리의 2D 리본 | TD05 로렌츠 3D 나비가 아니라 뢰슬러 평면 리본 |
| CH12 | ikeda-stream | IKEDA STREAM | 이케다 맵 점류의 소용돌이 물살 | CH03 삼각함수 베일이 아니라 이케다 소용돌이 |
| CH13 | tinkerbell | TINKERBELL | 팅커벨 맵 궤도의 가루 흩날림 | CH05 호팔롱 격자 점프가 아니라 팅커벨 궤도 |
| CH14 | gumowski-mira | GUMOWSKI MIRA | 구모프스키-미라 패턴의 세포형 윤곽 순회 | CH04 연기 대칭이 아니라 미라 세포 윤곽 |
| CH15 | standard-map | STANDARD MAP | 표준 맵 위상 공간의 섬과 카오스 바다 | CH08 1D 분기 스캔이 아니라 2D 위상 지도 |
| CH16 | magnetic-pendulum | MAGNETIC PENDULUM | 3자석 진자의 수렴 유역 경계 추적 | CH01 이중 관절이 아니라 자석 유역 경계 |
| CH17 | double-scroll | DOUBLE SCROLL | 추아 회로의 이중 소용돌이 왕복 | CH11 단일 두루마리가 아니라 이중 스크롤 왕복 |
| CH18 | henon-dust | HENON DUST | 에농 맵 습곡 주름의 선형 먼지 | CH03 면 베일이 아니라 습곡 주름 선형 구조 |
| CH19 | lozi-fold | LOZI FOLD | 로지 맵의 각진 절댓값 접힘 | CH18 매끄러운 습곡이 아니라 각진 접힘 |
| CH20 | halvorsen | HALVORSEN | 할보르센 끌개의 삼중 순환 대칭 리본 | CH11 비대칭 두루마리가 아니라 삼중 대칭 |
| CH21 | aizawa-bloom | AIZAWA BLOOM | 아이자와 끌개의 구각+축 관통 개화 | CH20 회전 리본이 아니라 구각 관통 구조 |
| CH22 | thomas-weave | THOMAS WEAVE | 토마스 끌개의 느린 순환 대칭 직조 산책 | CH20 발산 리본이 아니라 저속 직조 산책 |
| CH23 | predator-cycle | PREDATOR CYCLE | 로트카-볼테라 위상 평면의 극한 순환 궤도 | SY23 네트워크 흐름이 아니라 위상 평면 궤도 |
| CH24 | kuramoto-ring | KURAMOTO RING | 링 위 쿠라모토 진동자의 동기화 파와 키메라 | PT03 점멸 동기화가 아니라 위상 파동·키메라 |
| CH25 | intermittency | INTERMITTENCY | 잠잠하다 폭발하는 간헐성 카오스 시계열 | CH08 파라미터 스캔이 아니라 고정계 간헐 폭발 |

## WAVE 확장 v3 (`wave`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| WV11 | cymatic-plate | CYMATIC PLATE | 모래 입자가 마디로 모이는 클라드니 판 전환 | WV10 등고 지도가 아니라 입자 이동 클라드니 |
| WV12 | doppler-rings | DOPPLER RINGS | 이동 파원의 전방 압축·후방 이완 파문 | WV04 정지 파원이 아니라 이동 도플러 비대칭 |
| WV13 | rope-snap | ROPE SNAP | 줄 끝 펄스가 반사·중첩되는 단일 줄 전파 | WV06 다중 리본이 아니라 단일 줄 반사 중첩 |
| WV14 | tuning-forks | TUNING FORKS | 두 소리굽쇠의 맥놀이 울림과 감쇠 | WV07 격자 맥놀이가 아니라 시간 영역 울림쌍 |
| WV15 | wave-grating | WAVE GRATING | 격자를 통과한 파면의 회절 무늬 전개 | OP02 광선 부채가 아니라 파면 회절 전개 |
| WV16 | seiche-tank | SEICHE TANK | 수조 고유 진동이 좌우로 출렁이는 세이시 | FL16 회전 배수가 아니라 수조 고유 진동 |
| WV17 | spiral-wavefront | SPIRAL WAVEFRONT | 위상 특이점을 도는 나선 파면의 회전 | WV04 동심 파문이 아니라 나선 위상 특이점 |
| WV18 | membrane-drum | MEMBRANE DRUM | 원형 막 고유모드가 전환되는 북면 진동 | WV02 1D 마디가 아니라 2D 원형 막 모드 |
| WV19 | soliton-pass | SOLITON PASS | 형태를 보존한 채 교차 통과하는 솔리톤 쌍 | WV09 분산 묶음이 아니라 형태 보존 통과 |
| WV20 | shock-front | SHOCK FRONT | 파속을 추월한 파원이 만드는 마하 원뿔 | WV12 압축 링이 아니라 추월 충격 원뿔 |
| WV21 | whisper-gallery | WHISPER GALLERY | 곡면 벽을 따라 도는 속삭임 회랑 모드 | WV18 막 진동이 아니라 벽면 접선 전파 |
| WV22 | group-velocity | GROUP VELOCITY | 위상속도와 군속도가 어긋나는 파속의 이중 리듬 | WV09 단일 속도가 아니라 이중 속도 대비 |
| WV23 | refraction-shoal | REFRACTION SHOAL | 얕아지는 수심에 굴절해 해안에 정렬되는 파열 | WV01 직조 교차가 아니라 수심 굴절 정렬 |
| WV24 | antinode-lace | ANTINODE LACE | 직사각 2D 정상파 배가 짜는 레이스 전환 | WV18 원형 모드가 아니라 직사각 모드 레이스 |
| WV25 | resonant-column | RESONANT COLUMN | 수직 공명 기둥의 배음 사다리 점등 | WV03 수평 중첩이 아니라 수직 배음 사다리 |

## OPTICS 확장 v3 (`optics`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| OP11 | slit-scan | SLIT SCAN | 시간 슬라이스가 켜켜이 쌓이는 슬릿 스캔 왜곡 | OP08 대칭 반사가 아니라 시간 적층 왜곡 |
| OP12 | fresnel-zone | FRESNEL ZONE | 프레넬 존 플레이트 링의 초점 호흡 | OP01 격자 회전이 아니라 존 플레이트 초점 |
| OP13 | anamorphic-tilt | ANAMORPHIC TILT | 특정 각도에서만 정렬되는 아나모픽 사영 문양 | GM24 해칭 질감이 아니라 시점 정렬 사영 |
| OP14 | polarize-cross | POLARIZE CROSS | 교차 편광판 회전이 만드는 소광 명암 리듬 | OP04 분광 격자가 아니라 편광 소광 리듬 |
| OP15 | bokeh-drift | BOKEH DRIFT | 초점 밖 광원 원반이 부유하는 보케 야경 | OP06 조리개 기하가 아니라 초점외 원반 부유 |
| OP16 | zoetrope | ZOETROPE | 슬릿 스트로브가 만드는 조이트로프 잔상 애니메이션 | OP08 축 대칭 스캔이 아니라 슬릿 스트로브 잔상 |
| OP17 | shadow-theatre | SHADOW THEATRE | 도는 광원이 늘이는 그림자 군상의 무대 | OP09 광선 원뿔이 아니라 그림자 신축 군무 |
| OP18 | pinhole-array | PINHOLE ARRAY | 다중 핀홀이 투사하는 겹상 배열 | OP09 단일 광원이 아니라 다중 핀홀 겹상 |
| OP19 | glint-field | GLINT FIELD | 미세 반사면이 각도 따라 반짝이는 글린트 평원 | OP03 굴절 초점선이 아니라 통계적 스파클 |
| OP20 | spectrum-slide | SPECTRUM SLIDE | 팔레트 계조 띠가 프리즘처럼 활주하는 분광 | OP07 윤곽 색수차가 아니라 띠 전체 계조 활주 |
| OP21 | mirage-shimmer | MIRAGE SHIMMER | 열 아지랑이가 지평 반사상을 일렁이는 신기루 | OP10 격자 굴절이 아니라 반사상 열 일렁임 |
| OP22 | grid-lensing | GRID LENSING | 이동 렌즈가 격자를 국소 확대하며 지나가는 왜곡 | OP10 정적 굴절장이 아니라 이동 렌즈 왜곡 |
| OP23 | stereo-depth | STEREO DEPTH | 좌우 시차 진동으로 깊이가 튀어나오는 격자 | OP01 평면 모아레가 아니라 시차 입체 돌출 |
| OP24 | scanline-persist | SCANLINE PERSIST | CRT 주사선 인광 잔광이 그림을 그리는 과정 | OP16 슬릿 잔상이 아니라 인광 감쇠 드로잉 |
| OP25 | fiber-glow | FIBER GLOW | 광섬유 다발 속을 달려 끝점을 점등하는 신호 | OP09 자유 광선이 아니라 도관 구속 전달 |

## DATA 확장 v3 (`data`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| DT11 | sankey-flow | SANKEY FLOW | 유량 폭을 보존하며 분기하는 산키 리본 | SY01 항목 처리가 아니라 유량 보존 분기 |
| DT12 | spark-wall | SPARK WALL | 스파크라인 타일이 비동기로 갱신되는 차트 벽 | DT01 단일 계기가 아니라 타일 차트 벽 |
| DT13 | histogram-tide | HISTOGRAM TIDE | 분포 이동을 따라 출렁이는 히스토그램 조수 | DT01 신호 막대가 아니라 도수 분포 조수 |
| DT14 | chord-traffic | CHORD TRAFFIC | 원둘레 관계 코드가 명멸하는 코드 다이어그램 | DT03 회전 장부가 아니라 관계 코드 명멸 |
| DT15 | anomaly-scan | ANOMALY SCAN | 정상 대역 속 이상치가 탐지·강조되는 스캔 | DT04 다중 시계열이 아니라 이상 검출 강조 |
| DT16 | treemap-shift | TREEMAP SHIFT | 트리맵 타일 면적이 재배분되는 전환 | DT07 연속 표면이 아니라 이산 면적 재배분 |
| DT17 | gauge-cluster | GAUGE CLUSTER | 아날로그 게이지 바늘 군집의 공진 요동 | DT05 단일 방사가 아니라 바늘 군집 공진 |
| DT18 | log-stream | LOG STREAM | 로그 라인이 흐르고 에러가 버스트되는 콘솔 | TX20 활자 흐름이 아니라 레벨 구조·에러 버스트 |
| DT19 | correlation-web | CORRELATION WEB | 상관 강도가 링크 두께로 숨쉬는 변수망 | SY02 전파 확산이 아니라 상관 두께 호흡 |
| DT20 | candle-drift | CANDLE DRIFT | 캔들이 생성되고 이동평균이 추종하는 차트 | DT04 선형 스트림이 아니라 봉+이동평균 추종 |
| DT21 | radar-sweep | RADAR SWEEP | 소인 잔광과 표적 블립이 갱신되는 레이더 | DT05 인덱스 바가 아니라 소인 잔광·블립 |
| DT22 | bin-cascade | BIN CASCADE | 핀에 부딪힌 구슬이 정규분포로 쌓이는 골턴 보드 | PT04 안식각 더미가 아니라 이항 분포 수렴 |
| DT23 | network-load | NETWORK LOAD | 링크 부하가 색·두께로 맥동하는 토폴로지 맵 | SY06 토큰 순환이 아니라 부하 히트맵 |
| DT24 | census-dots | CENSUS DOTS | 점묘 개체가 재배치되며 군집을 이루는 지도 | DT10 수축·확장이 아니라 개체 이주 재배치 |
| DT25 | waveform-bank | WAVEFORM BANK | 채널 랙으로 분리된 파형들이 스크롤되는 계측 | DT04 겹침 플롯이 아니라 채널 랙 분리 |

## SYSTEM 확장 v3 (`system`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| SY11 | elevator-bank | ELEVATOR BANK | 호출을 배차받아 오르내리는 승강기 군 | SY01 수평 대기열이 아니라 수직 배차 스케줄 |
| SY12 | packet-maze | PACKET MAZE | 고정 미로에서 경로를 찾고 혼잡을 겪는 패킷들 | GM06 미로 생성이 아니라 라우팅·혼잡 동역학 |
| SY13 | clock-domains | CLOCK DOMAINS | 서로 다른 클럭 영역이 동기화 신호를 주고받는 회로 | SY10 연속 위상이 아니라 이산 클럭 브리지 |
| SY14 | supply-chain | SUPPLY CHAIN | 다단 재고가 증폭 요동하는 채찍 효과 | SY01 단일 파이프가 아니라 다단 증폭 요동 |
| SY15 | load-balancer | LOAD BALANCER | 부하 따라 동적 배분되고 스파이크를 흡수하는 서버 풀 | SY08 규칙 분기가 아니라 부하 기반 동적 배분 |
| SY16 | semaphore-junction | SEMAPHORE JUNCTION | 교차 흐름을 신호가 교대로 통과시키는 교차로 | SY06 순환 병목이 아니라 신호 교대 제어 |
| SY17 | cellular-relay | CELLULAR RELAY | 이동 노드가 셀 사이를 핸드오프하는 통신망 | SY02 소문 전파가 아니라 이동성 핸드오프 |
| SY18 | circuit-breaker | CIRCUIT BREAKER | 과부하 차단·반개방·복구를 오가는 보호 계전 | SY09 연쇄 잠금이 아니라 차단기 상태 기계 |
| SY19 | vote-quorum | VOTE QUORUM | 라운드 표결이 정족수에 도달하는 분산 합의 | SY05 위상 수렴이 아니라 라운드 표결 정족수 |
| SY20 | garbage-collect | GARBAGE COLLECT | 마킹·스윕·압축으로 회수되는 메모리 블록 | SY07 경로 잔상이 아니라 마킹·스윕 회수 |
| SY21 | pipeline-stages | PIPELINE STAGES | 명령이 다단 파이프라인을 흐르고 스톨이 전파 | SY01 단일 노드가 아니라 다단 스톨 전파 |
| SY22 | market-book | MARKET BOOK | 매수·매도 호가 잔량이 체결로 소멸하는 오더북 | DT20 가격 봉이 아니라 호가 잔량 체결 역학 |
| SY23 | ecosystem-web | ECOSYSTEM WEB | 영양 단계를 오르는 먹이망 에너지 흐름 | SY02 정보 확산이 아니라 영양 단계 에너지 |
| SY24 | thermostat-hunt | THERMOSTAT HUNT | 설정점 주위를 오버슈트로 헌팅하는 제어 루프 | SY04 증폭·감쇠 루프가 아니라 설정점 추종 헌팅 |
| SY25 | swarm-build | SWARM BUILD | 로봇 군집이 구조물을 협동 조립하는 작업장 | PT02 이동 군집이 아니라 목표 구조 조립 |

## KINETIC 확장 v3 (`kinetic`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| KN11 | watt-linkage | WATT LINKAGE | 직선 근사 궤적을 그리는 와트 링크 왕복 | KN05 파동 전달이 아니라 직선 근사 기구 |
| KN12 | geneva-drive | GENEVA DRIVE | 핀-슬롯이 만드는 제네바 간헐 회전 | KN09 연속 탈진이 아니라 간헐 회전 분할 |
| KN13 | flywheel-band | FLYWHEEL BAND | 플라이휠과 벨트가 동력을 전달하는 라인 | KN03 치합 회전이 아니라 벨트 장력 전달 |
| KN14 | hoberman-ring | HOBERMAN RING | 가위 링크 링이 반경을 신축하는 호버만 구조 | KN03 기어 개화가 아니라 가위 링크 신축 |
| KN15 | wiper-field | WIPER FIELD | 위상차 와이퍼 호가 화면을 쓸어내는 장 | KN02 자유 진자가 아니라 구동 와이퍼 청소 |
| KN16 | ratchet-crawl | RATCHET CRAWL | 한 방향으로 조금씩 전진하는 래칫 걸림 | KN09 시간 분할이 아니라 단방향 전진 래칫 |
| KN17 | trammel | TRAMMEL | 십자 슬롯을 타며 타원을 깎는 트라멜 왕복 | KN01 크랭크 원운동이 아니라 슬롯 타원 궤적 |
| KN18 | governor-spin | GOVERNOR SPIN | 원심 추가 벌어지며 속도를 제어하는 조속기 | KN08 왕복 박자가 아니라 원심 피드백 제어 |
| KN19 | chebyshev-walker | CHEBYSHEV WALKER | 보행 발끝 궤적을 그리는 체비쇼프 링크 행진 | KN05 파동 링크가 아니라 보행 궤적 행진 |
| KN20 | conveyor-sort | CONVEYOR SORT | 분기기가 물품을 분류하는 컨베이어 라인 | SY08 신호 분기가 아니라 물리 물품 분류 |
| KN21 | windmill-farm | WINDMILL FARM | 바람장 위상으로 도는 풍차 군의 평원 | KN06 추상 로터장이 아니라 바람 결합 풍차 |
| KN22 | scotch-yoke | SCOTCH YOKE | 요크 슬롯이 만드는 순수 사인 왕복 기구 | KN08 커넥팅 로드가 아니라 요크 순수 사인 |
| KN23 | pantograph | PANTOGRAPH | 도형을 확대 복사해 그리는 팬터그래프 팔 | KN17 타원 고정 궤적이 아니라 확대 복사 드로잉 |
| KN24 | metronome-sync | METRONOME SYNC | 공유 받침대로 동기화되어 가는 메트로놈들 | CH24 추상 위상이 아니라 받침대 역학 동기화 |
| KN25 | orrery | ORRERY | 기어열이 구동하는 태엽 태양계 모형의 공전 | TD11 3D 공전이 아니라 기어 구동 2D 태엽 모형 |

## TEXTILE 확장 v3 (`textile`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| TL11 | herringbone-flow | HERRINGBONE FLOW | V자 반전 사선이 지그재그로 흐르는 헤링본 | TL04 단일 사선이 아니라 V자 반전 지그재그 |
| TL12 | rib-stretch | RIB STRETCH | 골지 이랑이 당겨졌다 수축하는 신축 조직 | TL01 평직 교차가 아니라 이랑 신축 변형 |
| TL13 | dobby-program | DOBBY PROGRAM | 도비 카드 프로그램이 조직을 주기 갱신하는 직기 | TL08 노이즈 마스크가 아니라 카드 프로그램 주기 |
| TL14 | ikat-blur | IKAT BLUR | 경사 방향으로 무늬가 번지는 이카트 직물 | TL03 부유사 광택이 아니라 경사 방향 번짐 |
| TL15 | crochet-spiral | CROCHET SPIRAL | 나선 사슬코가 증식하는 코바늘 편물 | TL07 평면 땋기가 아니라 나선 사슬코 증식 |
| TL16 | net-mend | NET MEND | 그물코가 찢어지고 수선되는 순환 | TL09 정적 레이스가 아니라 파열·수선 순환 |
| TL17 | tassel-swing | TASSEL SWING | 관성으로 흔들리는 술 장식 열의 가장자리 | OR05 유체 흔들림이 아니라 강체 진자 스윙 |
| TL18 | patch-quilt | PATCH QUILT | 조각보 블록이 교체·재봉되는 퀼트 리듬 | GM18 기하 플립이 아니라 블록 교체·재봉 |
| TL19 | selvedge-scroll | SELVEDGE SCROLL | 셀비지 귀가 감기는 두루마리 직물 롤 | TL02 조직 위상이 아니라 두루마리 감김 |
| TL20 | shibori-fold | SHIBORI FOLD | 접기 대칭 방염 무늬가 펼쳐지는 시보리 | TL14 경사 번짐이 아니라 접기 대칭 방염 |
| TL21 | cable-knit | CABLE KNIT | 케이블 코가 입체로 교차하는 꽈배기 편물 | TL07 3가닥 평면이 아니라 케이블 입체 교차 |
| TL22 | loom-shed | LOOM SHED | 개구·북 통과·바디침이 반복되는 직조의 순간 | KN10 기계 링크가 아니라 직조 공정 사이클 |
| TL23 | fray-edge | FRAY EDGE | 올이 풀려 흩어지고 재직조되는 가장자리 | TL16 그물 수선이 아니라 올 풀림 확산 경계 |
| TL24 | houndstooth-march | HOUNDSTOOTH MARCH | 하운드투스 유닛이 위상 행진하는 패턴 | TL06 띠 펄스가 아니라 유닛 위상 행진 |
| TL25 | embroidery-trace | EMBROIDERY TRACE | 바늘땀이 밑그림을 따라 수놓는 자수 과정 | TX18 획 드로잉이 아니라 스티치 땀 추종 |

## FLUID 확장 v3 (`fluid`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| FL11 | karman-wake | KARMAN WAKE | 장애물 후류에 교대로 생기는 카르만 보텍스 열 | FL02 자유 소용돌이가 아니라 후류 교대 보텍스 |
| FL12 | droplet-merge | DROPLET MERGE | 표면 방울이 구르며 병합·낙하하는 응결 | FL05 기포 부유가 아니라 방울 병합 성장 |
| FL13 | shear-layer | SHEAR LAYER | 켈빈-헬름홀츠 말림이 자라는 전단층 | FL04 접힘 층류가 아니라 KH 불안정 말림 |
| FL14 | ferro-spike | FERRO SPIKE | 자기장에 반응해 가시가 솟는 페로플루이드 | FL06 표면 간섭색이 아니라 자기 스파이크 융기 |
| FL15 | lava-lamp | LAVA LAMP | 부력 방울이 오르내리며 합쳐지는 라바 램프 | FL08 연속 기둥이 아니라 이산 방울 부력 순환 |
| FL16 | whirlpool-drain | WHIRLPOOL DRAIN | 배수 소용돌이로 빨려드는 부유물과 수위 강하 | FL02 감김 궤적이 아니라 중심 흡입·수위 강하 |
| FL17 | viscous-finger | VISCOUS FINGER | 계면을 침투하며 분기하는 점성 손가락 | FL01 수동 이류가 아니라 계면 침투 분기 |
| FL18 | splash-crown | SPLASH CROWN | 낙하 방울의 왕관 기둥이 솟았다 무너지는 순환 | FL07 파문 간섭이 아니라 왕관 상승·붕괴 |
| FL19 | foam-drift | FOAM DRIFT | 거품 군집이 병합·재배열되는 표면 뗏목 | FL05 개별 기포가 아니라 거품망 재배열 |
| FL20 | jet-diffuse | JET DIFFUSE | 수평 제트가 주변과 섞이며 퍼지는 혼합 확산 | FL03 부력 상승이 아니라 수평 모멘텀 혼합 |
| FL21 | meander-carve | MEANDER CARVE | 곡률 피드백으로 사행하며 우각호를 남기는 강 | FD20 장 침식이 아니라 곡률 피드백 사행 |
| FL22 | convection-cells | CONVECTION CELLS | 베나르 대류 세포의 육각 순환 배열 | FL08 단일 기둥이 아니라 셀 배열 순환 |
| FL23 | wave-break | WAVE BREAK | 해안 파도가 말리고 부서지는 쇄파 순환 | WV23 파면 정렬이 아니라 말림·쇄파·백워시 |
| FL24 | fog-pond | FOG POND | 수면 위를 포복하는 저속 안개의 아침 연못 | FL03 상승 연기가 아니라 표면 포복 안개 |
| FL25 | sediment-settle | SEDIMENT SETTLE | 항력 지배로 침강해 층을 이루는 부유 퇴적물 | PT04 탄도 낙하가 아니라 항력 침강·성층 |

## MINIMAL 확장 v3 (`minimal`, p5)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| MN11 | lone-metronome | LONE METRONOME | 단일 선분의 등시 왕복 박자 | MN09 접힘 관절이 아니라 등시 왕복 |
| MN12 | dot-horizon | DOT HORIZON | 점 하나와 지평선이 만나는 일출의 반복 | MN10 경계 이동이 아니라 점·지평의 만남 |
| MN13 | gap-travel | GAP TRAVEL | 선분 열의 빈틈 하나가 자리를 옮기는 이동 | MN06 간격장 전체가 아니라 결핍 하나의 이동 |
| MN14 | slow-swap | SLOW SWAP | 두 사각형이 아주 느리게 자리를 바꾸는 교환 | MN05 연속 교환이 아니라 이산 자리바꿈 |
| MN15 | arc-remainder | ARC REMAINDER | 원호가 그려지고 지워지는 잔여의 순환 | MN01 궤도 점이 아니라 호 자체의 그리기·지움 |
| MN16 | tilt-balance | TILT BALANCE | 막대가 기울다 평형을 되찾는 복원 반복 | MN09 접힘·펴짐이 아니라 기울기 평형 복원 |
| MN17 | corner-fold | CORNER FOLD | 화면 모서리 하나가 접혔다 펴지는 종이 | MN09 선분 관절이 아니라 면 모서리 접힘 |
| MN18 | thin-veil | THIN VEIL | 반투명 막들이 겹치며 만드는 농담의 결 | MN06 선 간격이 아니라 막 겹침 농담 |
| MN19 | count-rest | COUNT REST | 점이 나타나고 쉼표처럼 사라지는 박자 | MN07 연속 펄스가 아니라 출현·쉼 구두점 |
| MN20 | axis-cross | AXIS CROSS | 두 축이 미세하게 회전·정렬되는 교차 | MN03 격자 점이 아니라 축 정렬 교차 |
| MN21 | shadow-inch | SHADOW INCH | 그림자 끝이 해시계처럼 포복하는 벽 | MN01 궤도 회전이 아니라 그림자 포복 |
| MN22 | line-kiss | LINE KISS | 두 선이 접근해 스치고 멀어지는 접선 | MN05 크기 교환이 아니라 접근·접촉·이탈 |
| MN23 | grid-blink | GRID BLINK | 성긴 점 격자에서 한 점씩 깜빡이는 교대 | MN03 점 이동이 아니라 자리 고정 명멸 |
| MN24 | slow-spill | SLOW SPILL | 경계 아래 면이 천천히 차오르는 수위 | MN10 선 이동이 아니라 면 수위 차오름 |
| MN25 | rest-note | REST NOTE | 여백 속 선율 같은 선 하나의 등장과 퇴장 | MN19 단일 점 박자가 아니라 선율적 프레이즈 |

## TOPOLOGY 확장 v3 (`topology`, three)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| TP11 | figure-eight | FIGURE EIGHT | 8자 매듭의 교차 구조를 도는 발광 궤적 | TP05 삼엽이 아니라 8자 매듭 교차 구조 |
| TP12 | hopf-fibers | HOPF FIBERS | 서로 전부 연결된 호프 원 다발의 층 회전 | TP04 강체 고리쌍이 아니라 전체 연결 원 다발 |
| TP13 | seifert-bands | SEIFERT BANDS | 매듭 경계를 메우는 자이페르트 띠 곡면 | TP08 매듭 궤도가 아니라 경계 충전 띠 곡면 |
| TP14 | unknot-dance | UNKNOT DANCE | 얽힌 곡선이 풀려 원이 되는 변형 순환 | TP02 고정 비틀림이 아니라 얽힘 해소 변형 |
| TP15 | chain-mail | CHAIN MAIL | 평면 고리망이 출렁이는 사슬 갑옷 | TP04 소수 고리가 아니라 격자 고리망 파동 |
| TP16 | twisted-prism | TWISTED PRISM | 다각 단면 기둥이 연속으로 꼬이는 회전 | TP02 띠 반비틀림이 아니라 기둥 연속 꼬임 |
| TP17 | helicoid-turn | HELICOID TURN | 나선 극소곡면이 감기며 상승하는 회전면 | TP06 위상 구멍이 아니라 나선 곡면 감김 |
| TP18 | catenoid-neck | CATENOID NECK | 카테노이드 목이 좁아졌다 벌어지는 신축 | TP17 나선면이 아니라 회전 대칭 목 신축 |
| TP19 | borromean | BORROMEAN | 셋이어야만 묶이는 보로메오 고리의 회전 | TP04 쌍별 관통이 아니라 삼중 상호 의존 |
| TP20 | ribbon-twist | RIBBON TWIST | 꼬임수가 늘었다 줄어드는 리본 링크 | TP02 고정 1회 비틀림이 아니라 꼬임수 증감 |
| TP21 | solenoid-coil | SOLENOID COIL | 토러스 내부를 감아 도는 솔레노이드 권선 | TP01 표면 폐곡선이 아니라 내부 권선 주행 |
| TP22 | pretzel-link | PRETZEL LINK | 프레첼형 다중 탱글 고리의 회전 | TP19 3고리 대칭이 아니라 프레첼 탱글 |
| TP23 | dual-skeleton | DUAL SKELETON | 다면체와 쌍대 골격이 서로를 관통 회전 | TP10 매듭선 케이지가 아니라 쌍대 관통 구조 |
| TP24 | weave-sphere | WEAVE SPHERE | 대원 궤도들이 구를 엮는 바구니 직조 | TP15 평면 고리망이 아니라 구면 대원 직조 |
| TP25 | immersion-flow | IMMERSION FLOW | 자기교차면 위를 흐르는 발광 궤적 주행 | TP03 정적 와이어가 아니라 면 위 궤적 주행 |

## COSMIC 확장 v3 (`cosmic`, three)

| ID | slug | title | 설명 | 근접·차별 |
|---|---|---|---|---|
| CS11 | binary-dance | BINARY DANCE | 쌍성이 질량을 주고받는 이동 스트림 | CS10 단일 중심이 아니라 쌍성 질량 교환 |
| CS12 | ring-collision | RING COLLISION | 충돌 고리파가 별들을 재배열하는 은하 | CS09 필라멘트 구조가 아니라 충돌 고리파 |
| CS13 | magnetar-field | MAGNETAR FIELD | 요동치는 자력선 다발의 마그네타 폭풍 | CS03 광선 스캔이 아니라 자력선 요동 폭풍 |
| CS14 | oort-halo | OORT HALO | 아득한 구각을 표류하는 오르트 미행성들 | CS08 평면 띠가 아니라 구각 껍질 표류 |
| CS15 | accretion-jet | ACCRETION JET | 강착 원반과 수직으로 분출하는 제트 | CS10 지평선 원반이 아니라 원반+수직 제트 |
| CS16 | tidal-stream | TIDAL STREAM | 위성은하가 찢겨 흐르는 조석 별 꼬리 | CS04 개별 꼬리가 아니라 은하 해체 스트림 |
| CS17 | supernova-shell | SUPERNOVA SHELL | 단발 폭발로 팽창하는 초신성 잔해 껍질 | CS02 호흡 구각이 아니라 폭발 팽창·잔광 |
| CS18 | exo-transit | EXO TRANSIT | 행성 통과가 광도 곡선을 깎는 관측 연출 | CS05 궤도 왜곡이 아니라 통과 광도 곡선 |
| CS19 | lagrange-drift | LAGRANGE DRIFT | L4·L5에 집속된 트로이 천체의 공전 | CS08 균일 띠가 아니라 라그랑주점 집속 |
| CS20 | galaxy-merge | GALAXY MERGE | 두 나선 은하가 조석으로 병합하는 춤 | CS01 단일 원반이 아니라 이중 원반 병합 |
| CS21 | dyson-lattice | DYSON LATTICE | 항성을 포위해 조립되는 다이슨 격자 | TD13 행성 궤도망이 아니라 항성 포위 조립 |
| CS22 | quasar-beacon | QUASAR BEACON | 광도가 맥동하는 퀘이사 등대 코어 | CS03 좁은 빔 회전이 아니라 광도 맥동 등대 |
| CS23 | rogue-planet | ROGUE PLANET | 무궤도로 성간을 표류하는 떠돌이 행성 | CS05 중심 공전이 아니라 무궤도 성간 표류 |
| CS24 | meteor-shower | METEOR SHOWER | 복사점에서 방사되는 유성우 다발 | CS04 곡선 스침이 아니라 복사점 방사 직선 |
| CS25 | pale-dot | PALE DOT | 창백한 점을 향해 물러나는 카메라와 별먼지 | CS09 망 구조가 아니라 후퇴 스케일 연출 |
