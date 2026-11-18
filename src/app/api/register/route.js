import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, "secret", { expiresIn: "7d" });
}

export async function POST(req) {
    try {
        const { name, username, password } = await req.json();

        if (!name || !username || !password) {
            return NextResponse.json({
                success: false,
                message: "All Fields required!"
            }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (exists) {
            return NextResponse.json({
                success: false,
                message: "A user with this username already exists."
            }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        });

        const token = generateToken(user.id);

        const response = NextResponse.json({
            success: true,
            name: user.name,
            username: user.username,
            password: user.password,
            token: token
        }, { status: 201 });

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