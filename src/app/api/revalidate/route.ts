// app/api/revalidate/route.ts
// https://<your-site.com>/api/revalidate?secret=<token>
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const revalidationSecret = request.headers.get("x-revalidate-secret");

  if (revalidationSecret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret token" },
      { status: 401 }
    );
  }

  try {
    // 원하는 경로를 재검증합니다. (예: 모든 경로를 재검증하려면 '/')
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    // 오류 발생 시
    return NextResponse.json("Error revalidating: " + err, { status: 500 });
  }
}
