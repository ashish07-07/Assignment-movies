import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, arg: any) {
  const genre1 = arg.params.authRoutes;
  const genre = genre1[0];
  console.log(genre);
  console.log(genre[0]);

  if (!genre || typeof genre !== "string") {
    return NextResponse.json(
      {
        error: "Invalid or missing genre parameter",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        genres: {
          some: {
            genre: {
              name: genre,
            },
          },
        },
      },
      include: {
        genres: true,
        ratings: true,
      },
    });

    return NextResponse.json({
      movies,
    });
  } catch (error) {
    console.error(`Error fetching movies by genre ${genre}:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch movies by genre",
      },
      {
        status: 500,
      }
    );
  }
}
