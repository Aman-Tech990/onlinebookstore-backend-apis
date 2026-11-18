import { prisma } from "@/lib/prisma";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "You do not have permission to view this reading list."
            }, { status: 401 });
        }

        const list = await prisma.readingList.findMany({
            where: {
                userId: user.id
            },
            select: {
                bookId: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "Reading List fetched successfully!",
            list: list
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {

        const { bookId } = await req.json();
        if (!bookId) {
            return NextResponse.json({
                success: false,
                message: "Book ID required!"
            }, { status: 401 });
        }

        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "You do not have permission to edit this reading list."
            }, { status: 401 });
        }

        const exists = await prisma.readingList.findFirst({
            where: {
                userId: user.id,
                bookId: Number(bookId)
            },
            select: {
                bookId: true,
                createdAt: true
            }
        });

        if (exists) {
            return NextResponse.json({
                success: false,
                message: "This book already exists in your reading list.",
            }, { status: 409 });
        }

        const list = await prisma.readingList.create({
            data: {
                userId: user.id,
                bookId: Number(bookId)
            }, select: {
                bookId: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: "Book added to Reading List successfully!",
            list: list
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

