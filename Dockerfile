FROM node:18-alpine

WORKDIR /app

# package.json과 pnpm-lock.yaml 복사
COPY package*.json ./
COPY pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치
RUN npm install -g pnpm && pnpm install

# 소스 코드 복사
COPY . .

# 빌드
RUN pnpm build

EXPOSE 3000

# 개발 모드로 실행
CMD ["pnpm", "start:dev"] 