# 배포 가이드

## Vercel 배포 (권장)

### 1. Vercel 계정 생성
[Vercel](https://vercel.com)에서 GitHub 계정으로 가입

### 2. GitHub 저장소 연결
```bash
# Git 초기화
git init
git add .
git commit -m "Initial commit: 걸뱅이크루 일정 관리"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/crew-schedule.git
git branch -M main
git push -u origin main
```

### 3. Vercel 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. 환경 변수 설정:
   - `GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID ([설정 가이드](GOOGLE_OAUTH_SETUP.md) 참조)
   - `GOOGLE_CLIENT_SECRET`: Google OAuth 클라이언트 보안 비밀번호
   - `AUTH_SECRET`: NextAuth 시크릿 (openssl rand -base64 32로 생성)
   - `NEXT_PUBLIC_BASE_URL`: (선택사항) 실제 도메인 입력

5. "Deploy" 클릭

### 5. 배포 후 설정
1. Vercel이 자동으로 도메인 할당 (예: `crew-schedule.vercel.app`)
2. Google Cloud Console로 돌아가서:
   - 승인된 JavaScript 원본에 `https://your-vercel-domain.vercel.app` 추가
   - 승인된 리디렉션 URI에 `https://your-vercel-domain.vercel.app/api/auth/callback/google` 추가
3. Vercel에서 재배포 (Deployments → 점 3개 메뉴 → Redeploy)

### 4. 도메인 설정
- Vercel이 자동으로 `*.vercel.app` 도메인 제공
- 커스텀 도메인 연결 가능

## 로컬 배포

### 프로덕션 빌드
```bash
npm run build
npm start
```

서버가 http://localhost:3000에서 실행됩니다.

## Docker 배포 (선택사항)

### Dockerfile 생성
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker 빌드 및 실행
```bash
docker build -t crew-schedule .
docker run -p 3000:3000 crew-schedule
```

## Netlify 배포

### netlify.toml 생성
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod
```

## 환경 변수 설정

### 개발 환경 (.env.local)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 프로덕션 환경
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## OG 이미지 업데이트

현재는 기본 SVG 이미지가 설정되어 있습니다. 커스텀 이미지로 변경하려면:

1. `public/og-image.svg` 또는 `public/og-image.jpg` 파일 교체
2. 이미지 크기: 1200x630 (카카오톡 권장)
3. `app/layout.tsx`에서 이미지 경로 확인

## 성능 최적화 체크리스트

### 빌드 시
- [x] TypeScript 컴파일 오류 없음
- [x] 코드 스플리팅 자동 적용
- [x] 정적 페이지 프리렌더링

### 배포 후
- [ ] Lighthouse 점수 확인 (90+ 목표)
- [ ] 모바일 반응형 테스트
- [ ] 카카오톡 링크 프리뷰 확인
- [ ] 크로스 브라우저 테스트

## 모니터링 설정

### Vercel Analytics (자동)
Vercel 배포 시 자동으로 Analytics 활성화

### Google Analytics (선택사항)
1. GA4 속성 생성
2. `app/layout.tsx`에 스크립트 추가
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

## 트러블슈팅

### 빌드 실패
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### LocalStorage 데이터 손실
- 사용자에게 브라우저 캐시 삭제 주의 안내
- 향후 백엔드 연동 권장

### OG 이미지 미표시
- metadataBase URL 확인
- 이미지 경로 확인
- 카카오톡 캐시 클리어 (24시간 후 재시도)

## 보안 체크리스트

- [x] 환경 변수 분리 (.env.example 제공)
- [x] 민감 정보 제외 (Git에 커밋 안 됨)
- [x] XSS 방지 (React 자동 이스케이핑)
- [x] HTTPS 강제 (Vercel 자동)

## 업데이트 배포

### Git 기반 자동 배포 (Vercel)
```bash
git add .
git commit -m "Update: 기능 설명"
git push origin main
```
Vercel이 자동으로 감지하여 재배포

### 수동 배포
```bash
vercel --prod
```

## 롤백

### Vercel
대시보드에서 이전 배포 버전 선택 후 "Promote to Production"

### Git
```bash
git revert HEAD
git push origin main
```

## 스케일링 고려사항

현재 구조는 클라이언트 사이드 전용입니다.
사용자가 많아지면 다음 단계로 확장:

1. **백엔드 API 추가**
   - Vercel Serverless Functions
   - 또는 별도 백엔드 서버 (Express, NestJS)

2. **데이터베이스 연동**
   - Vercel Postgres
   - MongoDB Atlas
   - Supabase

3. **실시간 기능**
   - Pusher
   - Ably
   - WebSocket 서버

## 비용 예상 (Vercel 기준)

- **Hobby Plan** (무료):
  - 무제한 배포
  - 100GB 대역폭/월
  - 소규모 팀에 충분

- **Pro Plan** ($20/월):
  - 1TB 대역폭/월
  - 우선 지원
  - 고급 분석

## 문의 및 지원

이슈가 있을 경우:
1. GitHub Issues 확인
2. Vercel 로그 확인
3. 브라우저 개발자 도구 콘솔 확인
