import prisma from "@/app/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        ratings: true,
      },
    });

    const moviesWithAverageRating = movies.map((movie) => {
      const averageRating =
        movie.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          movie.ratings.length || 0;
      return {
        ...movie,
        averageRating,
      };
    });

    const sortedMovies = moviesWithAverageRating.sort(
      (a, b) => b.averageRating - a.averageRating
    );

    return NextResponse.json(sortedMovies);
  } catch (error) {
    console.error("Error fetching movies sorted by rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies sorted by rating" },
      { status: 500 }
    );
  }
}
