# 프로젝트 아키텍처

## 디렉토리 구조

```
crew-schedule/
├── app/                          # Next.js App Router
│   ├── vote/[id]/               # 투표 페이지
│   │   ├── page.tsx             # 투표 UI
│   │   ├── layout.tsx           # 투표 페이지 레이아웃
│   │   └── opengraph-image.tsx  # 동적 OG 이미지
│   ├── result/[id]/             # 결과 페이지
│   │   └── page.tsx             # 결과 UI
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 메인 페이지 (일정 생성)
│   └── globals.css              # 글로벌 스타일
├── components/                   # 재사용 가능한 컴포넌트 (향후 확장)
├── lib/                         # 유틸리티 함수
│   └── utils.ts                 # ID 생성, 날짜 포맷팅 등
├── store/                       # Zustand 상태 관리
│   └── scheduleStore.ts         # 일정 스토어
├── types/                       # TypeScript 타입 정의
│   └── index.ts                 # 공통 타입
├── public/                      # 정적 파일
│   └── og-image.svg             # OG 이미지
├── package.json                 # 프로젝트 의존성
├── tsconfig.json                # TypeScript 설정
├── next.config.ts               # Next.js 설정
├── postcss.config.mjs           # PostCSS 설정
└── README.md                    # 프로젝트 문서
```

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 15.1
  - App Router 사용
  - React 19 Server Components
  - Turbopack 번들러

- **언어**: TypeScript 5.9
  - 타입 안정성 보장
  - 개발 경험 향상

- **스타일링**: Tailwind CSS 4.1
  - 유틸리티 우선 CSS
  - 모바일 우선 반응형 디자인
  - 커스텀 색상 시스템

### 상태 관리
- **Zustand 5.0**
  - 경량 상태 관리 라이브러리
  - React Context API 대비 간단한 API
  - TypeScript 완벽 지원

### 데이터 저장
- **LocalStorage**
  - 클라이언트 사이드 영구 저장소
  - 서버 없이 동작 가능
  - 브라우저 간 독립적

### 유틸리티
- **date-fns**: 날짜 포맷팅 및 조작
- **nanoid**: 고유 ID 생성

## 데이터 플로우

### 1. 일정 생성 플로우
```
사용자 입력
    ↓
폼 검증 (시간대, 멤버 확인)
    ↓
Schedule 객체 생성 (ID, 날짜, 시간대, 멤버)
    ↓
Zustand Store에 저장
    ↓
LocalStorage 동기화
    ↓
투표 페이지로 리다이렉트 (/vote/[id])
```

### 2. 투표 플로우
```
URL 파라미터에서 ID 추출
    ↓
LocalStorage에서 일정 데이터 로드
    ↓
Zustand Store 초기화
    ↓
사용자 멤버/시간 선택
    ↓
투표 검증 (중복 확인, 필수 필드 확인)
    ↓
Vote 객체 생성
    ↓
Schedule의 votes 배열에 추가
    ↓
LocalStorage 업데이트
    ↓
투표 기록 저장 (voted_${id}_${memberId})
    ↓
결과 페이지로 리다이렉트 (/result/[id])
```

### 3. 결과 조회 플로우
```
URL 파라미터에서 ID 추출
    ↓
LocalStorage에서 일정 데이터 로드
    ↓
투표 데이터 집계
    ↓
시간대별 통계 계산
    ↓
멤버별 상태 확인
    ↓
UI 렌더링
```

## 컴포넌트 구조

### 페이지 컴포넌트
모든 페이지는 'use client' 디렉티브 사용:
- LocalStorage 접근 필요
- 인터랙티브 UI 요구
- 실시간 상태 업데이트

### 상태 관리 패턴
```typescript
// Zustand Store 패턴
interface Store {
  data: T;
  actions: {
    add: () => void;
    update: () => void;
    get: () => T;
  };
}

// LocalStorage 동기화
const updateData = (newData) => {
  set({ data: newData });
  localStorage.setItem('key', JSON.stringify(newData));
};
```

## 라우팅 구조

### 정적 라우트
- `/` - 메인 페이지 (일정 생성)

### 동적 라우트
- `/vote/[id]` - 투표 페이지
- `/result/[id]` - 결과 페이지
- `/vote/[id]/opengraph-image` - OG 이미지 (Edge Runtime)

## 성능 최적화

### 빌드 최적화
- **Turbopack**: 빠른 번들링
- **Code Splitting**: 자동 페이지별 분할
- **Tree Shaking**: 미사용 코드 제거

### 런타임 최적화
- **Static Generation**: 가능한 페이지 사전 렌더링
- **Client-side Navigation**: SPA와 유사한 빠른 페이지 전환
- **LocalStorage Caching**: 네트워크 요청 최소화

### 이미지 최적화
- **SVG 사용**: 벡터 그래픽으로 확장성 보장
- **Dynamic OG Images**: Next.js ImageResponse API

## 브라우저 호환성

### 최소 요구사항
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 필수 기능
- LocalStorage API
- ES2020 JavaScript
- CSS Grid & Flexbox
- Fetch API

## 보안 고려사항

### 클라이언트 사이드
- **XSS 방지**: React 자동 이스케이핑
- **입력 검증**: 모든 사용자 입력 검증
- **URL 파라미터**: nanoid로 추측 불가능한 ID

### 데이터 저장
- **민감 정보 없음**: 개인 식별 정보 미포함
- **브라우저 격리**: 각 브라우저 독립적 저장소

## 확장성 고려사항

### 현재 제한사항
- LocalStorage 용량 제한 (약 5-10MB)
- 단일 브라우저 격리
- 실시간 동기화 없음

### 확장 방안
1. **백엔드 추가**
   - REST API 또는 GraphQL
   - 데이터베이스 (MongoDB, PostgreSQL)
   - 실시간 동기화 (WebSocket, SSE)

2. **인증 추가**
   - OAuth 2.0 (Google, Kakao)
   - JWT 토큰 관리
   - 사용자별 권한 관리

3. **기능 확장**
   - 푸시 알림 (Web Push API)
   - 오프라인 지원 (Service Worker)
   - 다중 디바이스 동기화

## 배포 전략

### Vercel (권장)
```bash
# Vercel CLI로 배포
npm i -g vercel
vercel
```

### 환경 변수
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 빌드 명령어
```bash
npm run build
npm start
```

## 모니터링 및 디버깅

### 개발 환경
- Next.js Dev Tools
- React DevTools
- Redux DevTools (Zustand)

### 프로덕션
- Vercel Analytics
- Error Boundaries
- Console Logging

## 테스트 전략

### 현재 상태
- 수동 테스트

### 향후 추가 가능
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright 또는 Cypress
- **Component Tests**: Storybook

## 유지보수

### 의존성 업데이트
```bash
# 정기적인 업데이트 확인
npm outdated

# 업데이트 실행
npm update
```

### 코드 품질
- ESLint 규칙 준수
- TypeScript strict 모드
- Prettier 포맷팅

## 라이선스
MIT License - 자유롭게 사용, 수정, 배포 가능
