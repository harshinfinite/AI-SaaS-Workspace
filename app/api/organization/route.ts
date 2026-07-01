import { auth } from '@/auth';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import connectDB from '@/server/db/mongoose';
import Organization from '@/server/models/Organization';
import OrgMember from '@/server/models/OrgMember';
import { createOrgSchema } from '@/lib/validations/organization';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const result = createOrgSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Something went Wrong!' },
        { status: 400 }
      );
    }
    await connectDB();
    const { name, slug } = result.data;
    const org = await Organization.findOne({ slug });
    if (org) {
      return NextResponse.json(
        { message: 'Slug already in use' },
        { status: 409 }
      );
    }
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
      { message: 'Organization Created Successfully!' },
      { status: 201 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went Wrong!' },
      { status: 500 }
    );
  }
}
export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const memberships = await OrgMember.find({ userId: session.user.id });
    const orgIds: mongoose.Types.ObjectId[] = memberships.map(
      (member) => member.orgId
    );
    const orgs = await Organization.find({ _id: { $in: orgIds } });
    return NextResponse.json({ organization: orgs }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'Unable to fetch Data, Try again' },
      { status: 500 }
    );
  }
}
