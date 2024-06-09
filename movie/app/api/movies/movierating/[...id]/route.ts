import prisma from "@/app/db";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, arg: any) {
  const res = arg.params.id;

  const userId = res[0];

  if (!userId) {
    return NextResponse.json(
      {
        error: "User id is recquired",
      },
      {
        status: 404,
      }
    );
  }

  const { rating, comment, movieId } = await req.json();

  if (!rating || !movieId || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating data" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const createdRating = await prisma.rating.create({
      data: {
        rating,
        comment,
        userId: user.id,
        movieId: parseInt(movieId),
      },
      include: {
        movie: true,
      },
    });

    return NextResponse.json(
      {
        message: "Rating created successfully",
        rating: createdRating,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e,
      },
      {
        status: 404,
      }
    );
  }
}
