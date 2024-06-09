import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      releaseDate,
      genres,
    }: {
      title: string;
      description?: string;
      releaseDate?: string;
      genres: string[];
    } = await req.json();

    const createdMovie = await prisma.movie.create({
      data: {
        title,
        description,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      },
    });

    const genreConnections = await Promise.all(
      genres.map(async (genre) => {
        let existingGenre = await prisma.genre.findUnique({
          where: { name: genre },
        });

        if (!existingGenre) {
          existingGenre = await prisma.genre.create({ data: { name: genre } });
        }

        return {
          movieId: createdMovie.id,
          genreId: existingGenre.id,
        };
      })
    );

    await prisma.movieGenre.createMany({
      data: genreConnections,
    });

    return NextResponse.json({ createdMovie }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "An error occurred while creating the movie" },
      { status: 500 }
    );
  }
}
