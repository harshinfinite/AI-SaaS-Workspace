import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Organization from '@/server/models/Organization';
import connectDB from '@/server/db/mongoose';
import OrgMember from '@/server/models/OrgMember';
import { createOrgSchema } from '@/lib/validations/organization';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const result = createOrgSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }
    const { name, slug } = result.data;
    await connectDB();
    const existing = await Organization.findOne({ slug });
    if (existing)
      return NextResponse.json(
        { message: 'slug already exists' },
        { status: 409 }
      );
    const newOrg = await Organization.create({
      name,
      slug,
      createdBy: session.user.id,
    });
    await OrgMember.create({
      userId: session.user.id,
      orgId: newOrg._id,
      role: 'owner',
    });
    return NextResponse.json(
      { message: 'Organization created' },
      { status: 201 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 }
    );
  }
}
export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const membership = await OrgMember.find({ userId: session.user.id });
    const orgIds: mongoose.Types.ObjectId[] = membership.map(
      (member) => member.orgId
    );
    const orgs = await Organization.find({ _id: { $in: orgIds } });
    return NextResponse.json({ organizations: orgs }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'Something Went wrong!' },
      { status: 500 }
    );
  }
}
