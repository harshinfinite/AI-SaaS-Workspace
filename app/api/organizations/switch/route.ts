import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OrgMember from '@/server/models/OrgMember';
import Organization from '@/server/models/Organization';
import { auth } from '@/auth';
import connectDB from '@/server/db/mongoose';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { orgId } = await request.json();
  try {
    await connectDB();
    const org = await Organization.findById(orgId);
    if (!org) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }
    const membership = await OrgMember.findOne({
      orgId,
      userId: session.user.id,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'You are not a member of this organization' },
        { status: 403 }
      );
    }
    const cookieStore = await cookies();
    cookieStore.set('activeOrgId', orgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });
    return NextResponse.json({ activeOrg: orgId }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
