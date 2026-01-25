# Vercel 배포 단계별 가이드

이 가이드는 걸뱅이크루 일정 관리 앱을 Vercel에 배포하는 전체 과정을 안내합니다.

## 사전 준비물

- [x] GitHub 계정
- [x] Vercel 계정 (GitHub로 가입 가능)
- [ ] Google OAuth 클라이언트 ID/Secret (아래에서 생성)

## 단계 1: Google OAuth 설정

먼저 Google OAuth 인증 정보를 생성해야 합니다.

### 1.1 Google Cloud Console 설정
자세한 내용은 [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)를 참조하세요.

간단 요약:
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성: "걸뱅이크루 일정 관리"
3. OAuth 동의 화면 구성 (외부 선택)
4. OAuth 클라이언트 ID 생성 (웹 애플리케이션)
5. 클라이언트 ID와 Secret 복사 및 저장

**⚠️ 중요**:
- 승인된 리디렉션 URI에 임시로 `http://localhost:3000/api/auth/callback/google` 추가
- 배포 후 Vercel 도메인으로 업데이트 예정

### 1.2 AUTH_SECRET 생성

터미널에서 다음 명령어 실행:

**Windows (PowerShell)**:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Mac/Linux**:
```bash
openssl rand -base64 32
```

생성된 문자열을 복사하세요.

## 단계 2: GitHub 저장소 생성

### 2.1 Git 초기화 및 커밋

프로젝트 디렉토리에서:

```bash
git init
git add .
git commit -m "feat: 걸뱅이크루 일정 관리 초기 커밋"
```

### 2.2 GitHub 저장소 생성

1. [GitHub](https://github.com) 접속
2. 우측 상단 "+" → "New repository" 클릭
3. 저장소 정보 입력:
   - **Repository name**: `crew-schedule` (또는 원하는 이름)
   - **Description**: `걸뱅이크루 일정 관리 시스템`
   - **Visibility**: Public 또는 Private 선택
   - **README, .gitignore, license 추가 안 함** (이미 있음)
4. "Create repository" 클릭

### 2.3 원격 저장소 연결 및 푸시

생성된 저장소 페이지에 표시되는 명령어 실행:

```bash
git remote add origin https://github.com/your-username/crew-schedule.git
git branch -M main
git push -u origin main
```

## 단계 3: Vercel 배포

### 3.1 Vercel 계정 생성 및 로그인

1. [Vercel](https://vercel.com) 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택하여 GitHub 계정으로 가입
4. Vercel이 GitHub 저장소 접근 권한 요청 시 승인

### 3.2 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 목록에서 `crew-schedule` 찾기
   - 목록에 없다면 "Adjust GitHub App Permissions" 클릭하여 권한 추가
3. "Import" 클릭

### 3.3 프로젝트 설정

**Configure Project** 화면에서:

1. **Project Name**: `crew-schedule` (자동 입력됨)
2. **Framework Preset**: Next.js (자동 감지됨)
3. **Root Directory**: `./` (그대로 유지)
4. **Build Settings**:
   - Build Command: `npm run build` (자동)
   - Output Directory: `.next` (자동)
   - Install Command: `npm install` (자동)

### 3.4 환경 변수 설정

**Environment Variables** 섹션에서:

1. `GOOGLE_CLIENT_ID` 추가:
   - Name: `GOOGLE_CLIENT_ID`
   - Value: Google OAuth에서 복사한 클라이언트 ID
   - Environment: Production, Preview, Development 모두 선택

2. `GOOGLE_CLIENT_SECRET` 추가:
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: Google OAuth에서 복사한 클라이언트 Secret
   - Environment: Production, Preview, Development 모두 선택

3. `AUTH_SECRET` 추가:
   - Name: `AUTH_SECRET`
   - Value: 단계 1.2에서 생성한 시크릿
   - Environment: Production, Preview, Development 모두 선택

**⚠️ 중요**: 환경 변수는 배포 후 변경할 수 없으므로 정확히 입력하세요.

### 3.5 배포 시작

"Deploy" 버튼 클릭

배포 진행 상황:
- Installing Dependencies... ⏳
- Building... ⏳
- Deploying... ⏳
- Ready! ✅ (1-3분 소요)

## 단계 4: 배포 후 설정

### 4.1 Vercel 도메인 확인

배포 완료 후:
1. "Visit" 버튼 클릭 또는 도메인 확인
2. 도메인 형식: `https://crew-schedule-xxxxx.vercel.app`
3. 도메인 복사

### 4.2 Google OAuth 리디렉션 URI 업데이트

1. [Google Cloud Console](https://console.cloud.google.com/) 재접속
2. 프로젝트 선택
3. "API 및 서비스" → "사용자 인증 정보"
4. 생성한 OAuth 2.0 클라이언트 ID 클릭
5. **승인된 JavaScript 원본** 추가:
   - `https://your-vercel-domain.vercel.app`
6. **승인된 리디렉션 URI** 추가:
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`
7. "저장" 클릭

### 4.3 Vercel 재배포

Google OAuth 설정 변경 후:
1. Vercel 대시보드 → 프로젝트 선택
2. "Deployments" 탭
3. 최신 배포 우측 점 3개 메뉴
4. "Redeploy" 클릭
5. "Redeploy" 확인

## 단계 5: 테스트

### 5.1 기본 기능 테스트

1. 배포된 사이트 접속: `https://your-domain.vercel.app`
2. 일정 생성 테스트:
   - 제목, 날짜, 시간대, 멤버 입력
   - "일정 만들기" 클릭
3. 투표 페이지로 이동 확인

### 5.2 구글 로그인 테스트

1. 투표 페이지에서 "Google로 로그인" 클릭
2. Google 계정 선택
3. 권한 승인
4. 자동으로 이름이 입력되는지 확인
5. 시간대 선택 후 투표

### 5.3 결과 페이지 테스트

1. "현재 결과 보기" 클릭
2. 투표 결과 정상 표시 확인
3. 시간대별 통계 확인
4. 멤버별 참여 현황 확인

### 5.4 모바일 테스트

1. 모바일 기기에서 링크 접속
2. 카카오톡으로 링크 공유 및 미리보기 확인
3. 모바일에서 투표 프로세스 테스트

## 단계 6: 커스텀 도메인 설정 (선택사항)

### 6.1 도메인 구매

도메인 등록 업체에서 도메인 구매:
- 가비아 (gabia.com)
- 카페24 (cafe24.com)
- Namecheap (namecheap.com)

### 6.2 Vercel에 도메인 추가

1. Vercel 프로젝트 → Settings → Domains
2. "Add" 클릭
3. 구매한 도메인 입력 (예: `crew.example.com`)
4. DNS 설정 안내 따라하기:
   - **A 레코드**: Vercel IP 주소 설정
   - 또는 **CNAME 레코드**: `cname.vercel-dns.com` 설정
5. DNS 전파 대기 (최대 48시간, 보통 1-2시간)

### 6.3 Google OAuth 업데이트

커스텀 도메인 추가 후:
1. Google Cloud Console
2. 승인된 JavaScript 원본 및 리디렉션 URI에 커스텀 도메인 추가
3. Vercel 재배포

## 문제 해결

### 빌드 실패

**증상**: "Build failed" 에러

**해결**:
1. Vercel 빌드 로그 확인
2. 로컬에서 `npm run build` 테스트
3. TypeScript 에러 확인 및 수정
4. Git 커밋 및 푸시 → 자동 재배포

### Google 로그인 실패

**증상**: "리디렉션 URI 불일치" 에러

**해결**:
1. Google Cloud Console의 리디렉션 URI 확인
2. 정확한 형식: `https://domain.vercel.app/api/auth/callback/google`
3. 후행 슬래시 없음
4. HTTPS 사용
5. Vercel 재배포

### 환경 변수 미적용

**증상**: 로그인 버튼 클릭 시 에러

**해결**:
1. Vercel 프로젝트 → Settings → Environment Variables
2. 모든 환경 변수 확인:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
3. 값이 올바른지 확인
4. 재배포 필수 (환경 변수 변경 시)

### "앱이 확인되지 않음" 경고

**증상**: Google 로그인 시 경고 화면

**해결** (개발/테스트 단계):
1. "고급" 클릭
2. "도메인으로 이동(안전하지 않음)" 클릭
3. 정상 진행

**해결** (프로덕션):
1. Google Cloud Console
2. OAuth 동의 화면
3. "앱 게시" 클릭
4. Google 검토 대기 (며칠 소요)

## 배포 완료!

축하합니다! 이제 다음 URL로 접속 가능합니다:
- **Vercel 도메인**: `https://your-vercel-domain.vercel.app`
- **커스텀 도메인** (설정 시): `https://your-domain.com`

## 다음 단계

1. **팀원에게 공유**:
   - 카카오톡에 링크 공유
   - OG 이미지 미리보기 확인

2. **모니터링**:
   - Vercel Analytics 확인
   - 사용자 피드백 수집

3. **업데이트**:
   - 코드 수정 후 Git 푸시 → 자동 배포
   - 기능 추가 및 개선

## 지원

문제가 있으신가요?
- [Vercel 문서](https://vercel.com/docs)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [프로젝트 GitHub Issues](https://github.com/your-username/crew-schedule/issues)
