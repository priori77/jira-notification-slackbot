Jira QA 상태 이슈 자동 알림

Jira에서 QA 상태 이슈를 모니터링하고 담당자에게 Slack DM으로 실시간 알림을 전송이 자동으로 이루어질 수 있도록 구현했습니다.

기능 설명
src/services/jira.service.ts
1. Jira API 연동 및 인증 처리
2. QA 상태 이슈 조회 (JQL 쿼리)
3. 이슈 상세 정보 및 담당자 데이터 수집

src/services/slack.service.ts
1. Slack Web API 클라이언트 관리
2. 사용자 이메일로 Slack 사용자 ID 조회
3. DM 채널 생성 및 메시지 전송

src/services/notification.service.ts
1. 메인 비즈니스 로직 처리
2. 신규/변경된 이슈 감지
3. 알림 전송 조정 및 오류 처리

src/utils/storage.ts
1. Vercel KV를 통한 영구 저장소 관리
2. 처리된 이슈 추적 및 중복 방지