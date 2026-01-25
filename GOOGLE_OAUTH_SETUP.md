# Google OAuth 설정 가이드

이 가이드는 구글 로그인 기능을 활성화하기 위한 Google OAuth 클라이언트 ID 및 Secret 발급 방법을 안내합니다.

## 1. Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

## 2. 프로젝트 생성

1. 상단 메뉴바에서 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "걸뱅이크루 일정 관리")
4. "만들기" 클릭
5. 생성된 프로젝트 선택

## 3. OAuth 동의 화면 구성

1. 좌측 메뉴에서 "API 및 서비스" → "OAuth 동의 화면" 선택
2. **User Type 선택**:
   - 테스트/개발용: "외부" 선택 (누구나 사용 가능)
   - 조직용: "내부" 선택 (도메인 내 사용자만)
3. "만들기" 클릭

### OAuth 동의 화면 정보 입력

#### 1단계: 앱 정보
- **앱 이름**: `걸뱅이크루 일정 관리`
- **사용자 지원 이메일**: 본인 이메일 선택
- **앱 로고** (선택사항): 로고 이미지 업로드
- **앱 도메인** (선택사항):
  - 애플리케이션 홈페이지: `https://your-domain.vercel.app`
  - 개인정보처리방침: (선택사항)
  - 서비스 약관: (선택사항)
- **승인된 도메인**: `vercel.app` 추가
- **개발자 연락처 정보**: 본인 이메일 입력
- "저장 후 계속" 클릭

#### 2단계: 범위
- "범위 추가 또는 삭제" 클릭
- 다음 범위 선택:
  - `/.../auth/userinfo.email` (이메일 주소 보기)
  - `/.../auth/userinfo.profile` (개인정보 보기)
  - `openid` (사용자 식별)
- "업데이트" 클릭
- "저장 후 계속" 클릭

#### 3단계: 테스트 사용자 (외부 선택 시)
- "테스트 사용자 추가" 클릭
- 테스트할 Google 계정 이메일 추가
- "저장 후 계속" 클릭

#### 4단계: 요약
- 설정 내용 확인
- "대시보드로 돌아가기" 클릭

## 4. OAuth 2.0 클라이언트 ID 생성

1. 좌측 메뉴에서 "API 및 서비스" → "사용자 인증 정보" 선택
2. 상단 "+ 사용자 인증 정보 만들기" 클릭
3. "OAuth 클라이언트 ID" 선택

### 클라이언트 ID 설정

1. **애플리케이션 유형**: "웹 애플리케이션" 선택
2. **이름**: `걸뱅이크루 웹 클라이언트`
3. **승인된 JavaScript 원본**:
   - 개발 환경: `http://localhost:3000`
   - 프로덕션: `https://your-domain.vercel.app`
4. **승인된 리디렉션 URI**:
   - 개발 환경: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://your-domain.vercel.app/api/auth/callback/google`
5. "만들기" 클릭

## 5. 클라이언트 정보 복사

생성 완료 후 표시되는 창에서:
1. **클라이언트 ID**: 복사
2. **클라이언트 보안 비밀번호**: 복사

⚠️ **중요**: 이 정보는 다시 확인할 수 있지만, 안전하게 보관하세요.

## 6. 환경 변수 설정

### 로컬 개발 환경

`.env.local` 파일에 다음 내용 추가:

```env
# Google OAuth 설정
GOOGLE_CLIENT_ID=복사한_클라이언트_ID
GOOGLE_CLIENT_SECRET=복사한_클라이언트_보안_비밀번호

# NextAuth 설정
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**AUTH_SECRET 생성 방법**:
```bash
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

### Vercel 배포 환경

Vercel 대시보드에서:
1. 프로젝트 선택 → Settings → Environment Variables
2. 다음 변수 추가:
   - `GOOGLE_CLIENT_ID`: 클라이언트 ID 입력
   - `GOOGLE_CLIENT_SECRET`: 클라이언트 보안 비밀번호 입력
   - `AUTH_SECRET`: 생성한 시크릿 입력
   - `NEXTAUTH_URL`: (선택사항, Vercel은 자동 감지)

## 7. 테스트

### 로컬 테스트
```bash
npm run dev
```
http://localhost:3000 접속 후 구글 로그인 테스트

### 프로덕션 테스트
Vercel 배포 후 실제 도메인에서 구글 로그인 테스트

## 8. 주의사항

### 개발 환경
- "외부" 유형으로 만든 경우, 테스트 사용자만 로그인 가능
- 최대 100명의 테스트 사용자 추가 가능

### 프로덕션 배포
프로덕션에서 모든 사용자가 로그인하려면:
1. OAuth 동의 화면에서 "앱 게시" 클릭
2. Google 검토 과정 필요 (며칠 소요 가능)
3. 또는 "테스트" 상태에서 사용자를 직접 추가

### 보안
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 포함되어 있는지 확인
- 클라이언트 보안 비밀번호는 안전하게 보관

## 9. 문제 해결

### "리디렉션 URI 불일치" 오류
- Google Cloud Console의 승인된 리디렉션 URI 확인
- URI는 정확히 일치해야 함 (후행 슬래시 주의)
- 올바른 형식: `https://domain.com/api/auth/callback/google`

### "앱이 확인되지 않음" 경고
- 개발/테스트 단계에서는 정상
- "고급" → "도메인으로 이동(안전하지 않음)" 클릭하여 진행
- 프로덕션에서는 앱 게시 필요

### 로그인 후 세션 없음
- `AUTH_SECRET`이 설정되었는지 확인
- Vercel 환경 변수가 올바르게 설정되었는지 확인
- 배포 후 재배포 필요할 수 있음

## 10. 도움말

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)

## 비용

Google OAuth는 **무료**입니다. 사용량 제한 없음.
