# 걸뱅이크루 일정 관리

걸뱅이크루 멤버들의 모임 일정을 쉽게 조율할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **일정 생성**: 모임 제목, 날짜, 시간대, 멤버 목록을 설정하여 일정을 생성
- **구글 로그인**: Google OAuth를 통한 간편 로그인으로 자동 이름 입력
- **투표 기능**: 멤버들이 가능한 시간대를 선택하여 투표
- **실시간 결과**: 시간대별, 멤버별 참여 현황을 실시간으로 확인
- **링크 공유**: 카카오톡으로 쉽게 공유할 수 있는 링크 생성
- **중복 방지**: 브라우저 캐시를 활용한 중복 투표 방지 (수정 가능)
- **모바일 최적화**: 모바일 환경에 최적화된 반응형 UI

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **인증**: NextAuth.js v5 (Google OAuth)
- **스타일링**: Tailwind CSS 4
- **상태관리**: Zustand
- **저장소**: LocalStorage

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

구글 로그인 기능을 사용하려면 Google OAuth 설정이 필요합니다.
자세한 내용은 [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)를 참조하세요.

`.env.local` 파일 생성:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 사용 방법

1. **일정 생성**: 메인 페이지에서 모임 정보를 입력하고 '일정 만들기' 버튼 클릭
2. **링크 공유**: 생성된 링크를 카카오톡으로 공유
3. **투표 참여**:
   - 구글 로그인으로 자동으로 이름이 입력됨 (권장)
   - 또는 멤버 리스트에서 직접 선택
   - 가능한 시간대 선택
4. **결과 확인**: 실시간으로 투표 결과 확인
5. **투표 수정**: 이미 투표한 멤버는 수정 모드로 투표 내용 변경 가능

## 배포

자세한 배포 방법은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요.

### 빠른 Vercel 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/crew-schedule)

⚠️ **중요**: Vercel 배포 시 환경 변수 설정을 잊지 마세요!
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET`

## 프로젝트 구조

```
crew-schedule/
├── app/                    # Next.js App Router
│   ├── vote/[id]/         # 투표 페이지
│   ├── result/[id]/       # 결과 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지 (일정 생성)
│   └── globals.css        # 글로벌 스타일
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 함수
├── store/                 # Zustand 스토어
├── types/                 # TypeScript 타입 정의
└── public/               # 정적 파일
```

## 라이선스

MIT
