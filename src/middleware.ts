import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SPAM_REFERRERS = [
  "hkt10.orderbeijingbistrobuda.com",
  "applynow.myeduplug.com",
  "travel.dailyschoolgist.com",
];

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer") ?? "";
  const isSpam = SPAM_REFERRERS.some((domain) => referer.includes(domain));
  if (isSpam) {
    return new NextResponse(null, { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
