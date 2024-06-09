import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name }: { name: string } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          msg: "Genre name is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingGenre = await prisma.genre.findUnique({
      where: {
        name: name,
      },
    });

    console.log(existingGenre);

    if (existingGenre) {
      return NextResponse.json(
        {
          msg: "Genre already exists",
        },
        {
          status: 400,
        }
      );
    }

    const createdGenre = await prisma.genre.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        createdGenre,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "An error occurred while creating the genre",
      },
      {
        status: 500,
      }
    );
  }
}
