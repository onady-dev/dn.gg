# Node.js 기반 이미지 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (개발 의존성 포함)
RUN npm install --production=false

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# 프로덕션 의존성만 다시 설치
RUN npm ci --only=production

# node 는 Node 환경에서 파일을 실행 시 사용되는 키워드이다.
# dist/main.js 는 node 키워드로 실행하고자 하는 파일의 경로이다.
# 즉, 도커 컨테이너가 실행될 때 dist/main.js 를 같이 실행(node) 한다.
CMD ["node", "dist/main.js"]

# 포트 노출
EXPOSE 4000
