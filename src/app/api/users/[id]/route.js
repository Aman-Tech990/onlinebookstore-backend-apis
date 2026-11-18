import { prisma } from "@/lib/prisma";
import { isAuth } from "@/middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access!"
            }, { status: 401 });
        }

        const { id } = await params;
        if (user.id !== Number(id)) {
            return NextResponse.json({
                success: false,
                message: "You do not have permission to view this user profile."
            }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            user_id: user.id,
            name: user.name,
            username: user.username
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const user = await isAuth(req);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access!"
            }, { status: 401 });
        }

        const { id } = await params;
        if (user.id !== Number(id)) {
            return NextResponse.json({
                success: false,
                message: "You do not have permission to view this user profile."
            }, { status: 403 });
        }

        const { name, username } = await req.json();

        if (!name && !username) {
            return NextResponse.json({
                success: false,
                message: "Atleast one field required!"
            }, { status: 400 });
        }

        let data = {};
        if (name) data.name = name;
        if (username) data.username = username;

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data
        });

        return NextResponse.json({
            success: true,
            name: updatedUser.name,
            username: updatedUser.username
        }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}