import mongoose from 'mongoose';
import Organization from '@/server/models/Organization';
import OrgMember from '@/server/models/OrgMember';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import connectDB from '@/server/db/mongoose';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = params;
    await connectDB();
    const org = await Organization.findById(id);
    if (!org) {
      return NextResponse.json(
        { message: 'Organization not Found!' },
        { status: 404 }
      );
    }
    const isMember = await OrgMember.findOne({
      orgId: id,
      userId: session.user.id,
    });
    if (!isMember) {
      return NextResponse.json({ message: 'Access Denied!' }, { status: 403 });
    }
    return NextResponse.json({ organization: org }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'something went wrong!' },
      { status: 500 }
    );
  }
}
