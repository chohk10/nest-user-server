# Test Server

NestJS 기반의 입사 과제 서버입니다.

## 주요 기능

- 사용자 인증 (JWT 기반)
  - 회원가입
  - 로그인/로그아웃
  - 쿠키 기반 토큰 관리
- 사용자 관리
  - 사용자 정보 조회/수정/삭제
  - 권한 기반 접근 제어 (OwnerGuard)
- API 문서화 (Swagger)

## 기술 스택

- NestJS
- TypeORM
- MySQL
- JWT
- Swagger
- Docker

## 시작하기

### 도커 실행 (권장)

1. 환경 변수 설정
```bash
# 환경 변수 파일 생성
cp .env.example .env

# .env 파일을 열어 내용 설정
```

2. 도커 컴포즈로 서버와 데이터베이스 실행
```bash
# 서비스 실행
pnpm docker:up

# 로그 확인
pnpm docker:logs

# 서비스 재시작
pnpm docker:restart

# 서비스 중지
pnpm docker:down
```

### API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: http://localhost:3000/api-doc

## 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test -- --coverage
```
