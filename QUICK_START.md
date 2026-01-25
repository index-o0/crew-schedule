# 빠른 시작 가이드

## 즉시 배포하기 (10분 완성)

### 1단계: Google OAuth 설정 (5분)
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. OAuth 동의 화면 구성 → "외부" 선택
4. OAuth 클라이언트 ID 생성 → "웹 애플리케이션"
5. 리디렉션 URI 추가: `http://localhost:3000/api/auth/callback/google`
6. 클라이언트 ID와 Secret 복사

상세 가이드: [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### 2단계: GitHub 업로드 (2분)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/crew-schedule.git
git push -u origin main
```

### 3단계: Vercel 배포 (3분)
1. [Vercel](https://vercel.com)에서 GitHub로 로그인
2. "New Project" → 저장소 선택
3. 환경 변수 입력:
   - `GOOGLE_CLIENT_ID`: (복사한 값)
   - `GOOGLE_CLIENT_SECRET`: (복사한 값)
   - `AUTH_SECRET`: (PowerShell에서 `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))` 실행)
4. "Deploy" 클릭

### 4단계: Google OAuth 업데이트 (1분)
1. Vercel 도메인 확인 (예: `crew-schedule-xxx.vercel.app`)
2. Google Cloud Console로 돌아가기
3. 리디렉션 URI 추가:
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google`
4. Vercel에서 재배포

## 완료!

이제 링크를 카카오톡으로 공유하세요!

## 문제 해결

**로그인 안 됨?**
→ Google OAuth 리디렉션 URI 확인

**빌드 실패?**
→ 환경 변수 다시 확인

**자세한 가이드**
→ [VERCEL_DEPLOY_GUIDE.md](VERCEL_DEPLOY_GUIDE.md)
