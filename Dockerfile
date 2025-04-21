# Node.js 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# node 는 Node 환경에서 파일을 실행 시 사용되는 키워드이다.
# dist/main.js 는 node 키워드로 실행하고자 하는 파일의 경로이다.
# 즉, 도커 컨테이너가 실행될 때 dist/mian.js 를 같이 실행(node) 한다.
# CMD [ "node","dist/main.js" ]
# CMD ["npm", "run", "start:dev"]
CMD ["node", "dist/main.js"]
# 포트 노출
EXPOSE 4000
