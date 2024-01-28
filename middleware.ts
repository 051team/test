import { NextResponse,NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";


export async function middleware(req: NextRequest, res:NextResponse) {
  try {
    console.log("middleware working");
    const ads = [process.env.AD1,process.env.AD2,process.env.AD3];
    const token = await getToken({ req: req,secret:process.env.NEXTAUTH_SECRET});
    const adToken = token?.sub;
    if(!ads.includes(adToken)|| !token){
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.log(error)
  }

  const response = NextResponse.next();
  return response

}

export const config = {
  matcher: '/suser',
};