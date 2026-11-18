import { prisma } from "@/lib/prisma";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: "false",
                message: "Unauthorized access!"
            }, { status: 401 });
        }

        const books = await prisma.book.findMany();
        return NextResponse.json({
            success: "true",
            books
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}