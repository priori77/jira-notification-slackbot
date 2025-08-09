# Vercel 배포 가이드

## 1. Vercel 계정 준비

### 1.1 Vercel 가입
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 가입 (권장)
4. 이메일 인증 완료

## 2. GitHub 저장소 연결

### 2.1 새 프로젝트 생성
1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. "Import Git Repository" 선택
3. GitHub 계정 연결 (처음인 경우)
4. 저장소 목록에서 `jira-slackbot` 선택
5. "Import" 클릭

## 3. 프로젝트 설정

### 3.1 기본 설정
- **Framework Preset**: Other (자동 감지됨)
- **Root Directory**: ./ (기본값 유지)
- **Build and Output Settings**: 기본값 유지

### 3.2 환경변수 설정 (중요!)

"Environment Variables" 섹션에서 다음 변수들을 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `JIRA_HOST` | `https://your-domain.atlassian.net` | Production |
| `JIRA_EMAIL` | `your-email@gmail.com` | Production |
| `JIRA_API_TOKEN` | `your-jira-api-token` | Production |
| `SLACK_BOT_TOKEN` | `xoxb-your-slack-token` | Production |
| `CRON_SECRET` | `생성한-보안-문자열` | Production |

**환경변수 추가 방법:**
1. "Add" 버튼 클릭
2. Name 입력
3. Value 입력 (실제 값으로 교체)
4. Environment는 "Production" 선택
5. "Save" 클릭

### 3.3 배포
- 모든 환경변수 입력 완료 후 "Deploy" 클릭
- 배포가 시작되며 2-3분 소요

## 4. Cron Job 설정 확인

### 4.1 Functions 탭 확인
1. 배포 완료 후 프로젝트 대시보드로 이동
2. "Functions" 탭 클릭
3. `api/cron` 함수가 보이는지 확인

### 4.2 Cron 스케줄 확인
- Vercel은 `vercel.json`의 설정을 자동으로 읽음
- 5분마다 실행되도록 설정됨 (`*/5 * * * *`)

## 5. 보안 설정 (선택사항)

### 5.1 CRON_SECRET 생성
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
-join ((1..32) | ForEach {'{0:X}' -f (Get-Random -Max 256)})
```

### 5.2 Cron Job 보안
- 생성한 값을 `CRON_SECRET` 환경변수에 설정
- 외부에서 API 엔드포인트 직접 호출 방지

## 6. 배포 확인

### 6.1 배포 URL 확인
- 배포 완료 후 제공되는 URL 확인
- 형식: `https://your-project-name.vercel.app`

### 6.2 수동 테스트
브라우저에서 다음 URL 접속:
```
https://your-project-name.vercel.app/api/cron
```

**예상 응답:**
- CRON_SECRET 설정 시: `{"error":"Unauthorized"}`
- 설정하지 않은 경우: `{"success":true,...}`

### 6.3 로그 확인
1. Vercel 대시보드에서 "Functions" 탭
2. `api/cron` 클릭
3. "Logs" 탭에서 실행 로그 확인

## 7. 모니터링

### 7.1 실행 확인
- Functions 로그에서 5분마다 실행되는지 확인
- "Invocations" 차트 확인

### 7.2 에러 확인
- 에러 발생 시 로그에 표시됨
- 주로 환경변수 누락이 원인

## 8. 문제 해결

### 환경변수 오류
**증상**: "Missing required environment variables"
**해결**: 
1. Settings → Environment Variables
2. 모든 필수 변수가 있는지 확인
3. 값이 올바른지 확인
4. Redeploy 실행

### Cron이 실행되지 않음
**증상**: Functions 로그에 실행 기록 없음
**해결**:
1. `vercel.json` 파일 확인
2. GitHub에 푸시되었는지 확인
3. Vercel에서 최신 커밋 배포되었는지 확인

### API 인증 실패
**증상**: 401 또는 403 에러
**해결**:
1. Jira API 토큰 재확인
2. Slack Bot 토큰 재확인
3. 이메일 주소 확인

## 9. 재배포 방법

### 코드 변경 시
1. GitHub에 푸시하면 자동 재배포

### 환경변수 변경 시
1. Settings → Environment Variables에서 수정
2. "Redeploy" 버튼 클릭
3. "Use existing Build Cache" 체크 해제
4. "Redeploy" 클릭

## 10. 성공 확인

모든 설정이 완료되면:
1. 5분마다 Jira QA 이슈 체크
2. 새 이슈 발견 시 Slack DM 전송
3. Functions 로그에서 실행 확인 가능

축하합니다! 🎉 Jira-Slack 연동이 완료되었습니다.