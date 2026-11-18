import { isAllowed } from "@/middlewares/isAllowed";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const user = await isAuth(req);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not logged in!"
            }, { status: 401 });
        }

        if (!isAllowed(user, "USER")) {
            return NextResponse.json({
                success: false,
                message: "Forbidden!"
            }, { status: 403 });
        }

        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 });

        response.cookies.set("token", "", { maxAge: 0 });

        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}