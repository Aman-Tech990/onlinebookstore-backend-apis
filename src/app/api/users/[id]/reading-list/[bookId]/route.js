import { prisma } from "@/lib/prisma";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "You do not have permission to edit this reading list."
            }, { status: 401 });
        }

        const { bookId } = await params;

        const exists = await prisma.readingList.findFirst({
            where: {
                userId: user.id,
                bookId: Number(bookId)
            }
        });

        if (!exists) {
            return NextResponse.json({
                success: false,
                message: "This book does not exists in your reading list.",
            }, { status: 400 });
        }

        const deletedList = await prisma.readingList.delete({
            where: {
                id: exists.id
            }
        })

        return NextResponse.json({
            success: true,
            message: "Book deleted from Reading List successfully!",
            deletedList: deletedList
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

