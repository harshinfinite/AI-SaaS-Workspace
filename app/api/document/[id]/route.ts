import Doc from '@/server/models/Document';
import connectDB from '@/server/db/mongoose';
import { auth } from '@/auth';
import OrgMember from '@/server/models/OrgMember';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const currentCookies = await cookies();
    const activeOrgId = currentCookies.get('activeOrgId')?.value;
    if (!activeOrgId) {
      return NextResponse.json(
        { message: 'No active organization selected' },
        { status: 400 }
      );
    }
    await connectDB();
    const membership = await OrgMember.findOne({
      userId: session.user.id,
      orgId: activeOrgId,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'Not member of this Organization' },
        { status: 403 }
      );
    }
    const curDoc = await Doc.findOne({ _id: id, orgId: activeOrgId });
    if (!curDoc) {
      return NextResponse.json(
        { message: 'Document Not found!' },
        { status: 404 }
      );
    }
    return NextResponse.json({ doc: curDoc }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
