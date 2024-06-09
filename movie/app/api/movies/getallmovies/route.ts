import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        genres: true,
        ratings: true,
      },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, 500);
  }
}
