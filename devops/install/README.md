# WordPress 로컬 개발환경 설치 가이드

## 개요
{{env.EXTERNAL_PORT}} 포트에서 실행되는 WordPress 로컬 개발환경입니다.

## 시스템 요구사항
- Docker
- Docker Compose

## 설치 방법

### 1. 환경 변수 설정
```bash
cd /home/gupsa/문서/Host/{{env.EXTERNAL_PORT}}/www.deegolabs.com
cp .env.example .env
```

`.env` 파일을 열어 필요한 값을 수정하세요.

### 2. Docker Compose 실행
```bash
docker compose up -d
```

### 3. 설치 확인
브라우저에서 다음 URL로 접속:
- **사이트**: http://localhost:{{env.EXTERNAL_PORT}}
- **관리자 페이지**: http://localhost:{{env.EXTERNAL_PORT}}/wp-admin

### 4. 관리자 로그인 정보
- **이메일**: devops@gupsa.com
- **비밀번호**: rlacjawl1@

## 컨테이너 구성

| 컨테이너 | 역할 | 포트 |
|---------|------|------|
| wp-nginx | 웹 서버 | {{env.EXTERNAL_PORT}} (외부) → 80 (내부) |
| wp-wordpress | WordPress (PHP-FPM) | 내부 네트워크만 |
| wp-mysql | MySQL 데이터베이스 | 내부 네트워크만 |
| wp-cli | WordPress CLI (자동 설치) | 내부 네트워크만 |

## 주요 명령어

### 컨테이너 시작
```bash
docker compose up -d
```

### 컨테이너 중지
```bash
docker compose down
```

### 컨테이너 재시작
```bash
docker compose restart
```

### 로그 확인
```bash
docker compose logs -f
```

### WordPress CLI 사용
```bash
docker compose exec wordpress-cli wp --help
```

## 볼륨 매핑

- `./wp-content` → WordPress 테마, 플러그인, 업로드 파일
- `wordpress_data` → WordPress 코어 파일 (Docker 볼륨)
- `mysql_data` → MySQL 데이터 (Docker 볼륨)

## 트러블슈팅

### 포트 {{env.EXTERNAL_PORT}}이 이미 사용 중인 경우
```bash
# 해당 포트를 사용하는 프로세스 확인
sudo lsof -i :{{env.EXTERNAL_PORT}}

# 프로세스 종료
sudo kill -9 <PID>
```

### WordPress 재설치
```bash
# 모든 데이터 삭제 후 재설치
docker compose down -v
docker compose up -d
```

### 권한 문제
```bash
# wp-content 폴더 권한 수정
sudo chown -R www-data:www-data ./wp-content
sudo chmod -R 755 ./wp-content
```

## 언어 및 시간대
- **언어**: 한국어 (ko_KR)
- **시간대**: Asia/Seoul

## 데이터베이스 접속 정보
- **호스트**: mysql:3306 (내부 네트워크)
- **데이터베이스**: wordpress
- **사용자**: wordpress
- **비밀번호**: wordpress123 (`.env` 파일 참조)
