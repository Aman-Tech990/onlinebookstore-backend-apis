import { prisma } from "@/lib/prisma";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: "false",
                message: "Unauthorized access!"
            }, { status: 401 });
        }

        const { id } = await params;
        const book = await prisma.book.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!book) {
            return NextResponse.json({
                success: false,
                message: "Book not found!"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: "true",
            book
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}