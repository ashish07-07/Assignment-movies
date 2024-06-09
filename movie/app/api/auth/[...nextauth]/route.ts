import NextAuth from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/app/db";
import { NEXT_AUTH } from "@/app/lib/auth";

const handler = NextAuth(NEXT_AUTH);

export const GET = handler;
export const POST = handler;
