## Getting Started

First, install packages:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Seconds, run the convex:

```bash
npx convex dev
# or
bunx convex dev
```

Third, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Setting DB

### 데이터를 Convex에 업로드

npx convex import --table quizzes data/quizzesData.jsonl --replace --yes

### 2. 업로드 성공 후, Next.js 캐시 revalidation을 위해 webhook 호출

curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET_TOKEN"
