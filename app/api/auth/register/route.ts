import { registerSchema } from '@/lib/validations/auth';
import connectDB from '@/server/db/mongoose';
import User from '@/server/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json(
        { message: 'Something Went Wrong!' },
        { status: 400 }
      );
    await connectDB();
    const { name, email, password } = result.data;
    const user = await User.findOne({ email });
    if (user)
      return NextResponse.json(
        { message: 'Email is already in Use!' },
        { status: 409 }
      );
    const hashPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashPassword });
    return NextResponse.json(
      { message: 'Account Created Successfully!' },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something Went Wrong!';
    return NextResponse.json({ message }, { status: 500 });
  }
}
