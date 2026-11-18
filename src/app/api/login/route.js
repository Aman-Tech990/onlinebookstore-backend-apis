import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, "secret", { expiresIn: "7d" });
}

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: "All Fields required!"
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid username or password."
            }, { status: 401 });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return NextResponse.json({
                success: false,
                message: "Invalid username or password."
            }, { status: 401 });
        }

        const token = generateToken(user.id);
        const response = NextResponse.json({
            success: true,
            username: user.username,
            password: user.password,
            token: token
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return response;

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: true,
            message: "Internal Server Error!"
        }, { status: 500 });
    }
}