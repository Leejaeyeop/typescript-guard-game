// app/api/revalidate/route.ts
// https://<your-site.com>/api/revalidate?secret=<token>
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret token" },
      { status: 401 }
    );
  }

  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
