## 폴더 구조

{포트번호}/{전체도메인명}

## 룰
로컬 개발환경을 구축하여 원활한 테스트환경 구축

# 워드프레스 개발 정보
Block themes 를 사용하여 개발한다 (문서 : https://wordpress.org/documentation/article/block-themes)

## 관리자 계정 관리방법

서비스마다 다음의 .env 파일에 정보를 필수로 추가한다
기본값이 있다면 다음과 같이 변경한다

SERVICE_ADMIN_ID=admin
SERVICE_ADMIN_PASSWORD=password

## .env 관리 룰

모든 정보는 .env 에 저장한다
기본값은 .env 외의 코드에 넣지 않는다
(중요) .env 파일 외에 모든 곳에서는 기본값이 없으면 오류가 발생하는 것이 맞다

## 포트번호 관리

{포트번호}/{전체도메인명} 으로 관리하고 실행한다
포트가 다양하게 존재한다면 서비스 접근 gui 컨테이너 기준으로 연결한다
포트번호가 겹친다면 그 포트를 kill 하여 관리한다
외부 포트는 .env 파일의 EXTERNAL_PORT 변수로 관리한다

## 확인 과정

크롬 브라우저를 직접 띄워서 확인한다
앞으로 playwright 를 통해 확인하는 과정을 e2e 로 부른다

## Playwright 사용 규칙

### MCP를 통한 브라우저 제어
- 모든 브라우저 접근 및 제어는 mcp__playwright_browser_navigate 도구를 우선적으로 사용한다
- 직접적인 HTTP 요청이나 curl 대신 MCP Playwright 도구를 사용한다
- WebFetch 도구 대신 MCP Playwright 도구를 우선 사용한다

### 테스트 코드 관리
- Playwright 테스트 코드(@playwright/test)는 생성하지 않는다
- 대신 일반 Node.js 스크립트로 Playwright를 사용한다
- setup.js와 같은 자동화 스크립트 형태로 작성한다

### 자동화 스크립트 작성
- 서비스 초기 설정은 Playwright 자동화 스크립트로 작성한다
- 스크립트는 {포트명}/playwright/{년월일시분초}.js 형태로 저장한다
- headless: false 로 설정하여 실행 과정을 확인할 수 있게 한다

## 트러블슈팅

문제가 발생 후 해결되었다면 (해결되지 않았다면 적지 않아야해)
trouble/{년월일시분초}.md 폴더를 만들어 그 내용을 요약해서 넣어줘