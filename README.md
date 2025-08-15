# Jira QA 알림 봇

Jira의 QA 상태 이슈를 모니터링하고 담당자에게 Slack DM으로 실시간 알림을 전송하는 자동화 봇입니다.

## 주요 기능

### 자동 알림 시스템
- 5분마다 Jira에서 "QA" 상태의 이슈를 자동으로 확인
- 새로운 QA 이슈가 할당되면 담당자에게 즉시 Slack DM 전송
- 중복 알림 방지를 위한 이슈 상태 추적
- Vercel Cron Job을 통한 안정적인 스케줄링

### 알림 메시지 구성
- 이슈 제목 및 설명
- Jira 이슈 링크
- 담당자 정보
- 상태 변경 시각

### 데이터 관리
- Vercel KV를 통한 처리된 이슈 추적
- 이슈 상태 변경 감지 및 업데이트

## 핵심 구성 요소

### src/services/jira.service.ts
1. Jira API 연동 및 인증 처리
2. QA 상태 이슈 조회 (JQL 쿼리)
3. 이슈 상세 정보 및 담당자 데이터 수집

### src/services/slack.service.ts
1. Slack Web API 클라이언트 관리
2. 사용자 이메일로 Slack 사용자 ID 조회
3. DM 채널 생성 및 메시지 전송

### src/services/notification.service.ts
1. 메인 비즈니스 로직 처리
2. 신규/변경된 이슈 감지
3. 알림 전송 조정 및 오류 처리

### src/utils/storage.ts
1. Vercel KV를 통한 영구 저장소 관리
2. 처리된 이슈 추적 및 중복 방지

## 설치 및 설정

### 사전 요구사항
- Node.js 18.x 이상
- Vercel 계정
- Jira 및 Slack 워크스페이스 관리 권한

### 프로젝트 설정
1. 저장소 클론 및 의존성 설치
```bash
git clone <repository-url>
cd jira-slackbot
npm install
```

2. 환경 변수 설정
```bash
cp .env.example .env
```

3. 필수 환경 변수 구성
   - `JIRA_HOST`: Jira 인스턴스 URL
   - `JIRA_EMAIL`: Jira 인증용 이메일
   - `JIRA_API_TOKEN`: Jira API 토큰
   - `SLACK_BOT_TOKEN`: Slack Bot User OAuth Token
   - `CRON_SECRET`: Cron 엔드포인트 보안 키

### Jira 설정
1. [Jira API 토큰 생성](https://id.atlassian.com/manage-profile/security/api-tokens)
2. API 토큰 복사 및 환경 변수에 추가

### Slack 앱 설정
1. [Slack API](https://api.slack.com/apps)에서 새 앱 생성
2. OAuth & Permissions 설정
3. 필수 Bot Token Scopes 추가:
   - `users:read`
   - `users:read.email`
   - `chat:write`
   - `im:write`
4. 워크스페이스에 앱 설치
5. Bot User OAuth Token 복사

### Vercel 배포
1. Vercel CLI로 배포
```bash
vercel
```

2. Vercel 대시보드에서 환경 변수 추가
3. Cron Job 설정 확인 (vercel.json)

## 개발 환경

### 로컬 실행
```bash
npm run dev
```

### 테스트
```bash
npm test
```

### 빌드
```bash
npm run build
```

## API 엔드포인트

### /api/cron
- **용도**: Vercel Cron Job 웹훅 엔드포인트
- **주기**: 5분마다 실행
- **보안**: CRON_SECRET 헤더 검증

## 문제 해결

### 일반적인 문제
1. **Slack DM이 전송되지 않는 경우**
   - Bot Token 권한 확인
   - 사용자 이메일이 Jira와 Slack에서 일치하는지 확인

2. **Jira 이슈를 가져오지 못하는 경우**
   - API 토큰 유효성 확인
   - JQL 쿼리 문법 검증

3. **중복 알림이 발생하는 경우**
   - Vercel KV 연결 상태 확인
   - 스토리지 키 충돌 여부 점검