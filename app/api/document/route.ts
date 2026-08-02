import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import connectDB from '@/server/db/mongoose';
import { cookies } from 'next/headers';
import OrgMember from '@/server/models/OrgMember';
import { canCreateDocument } from '@/lib/permission';
import { documentSchema } from '@/lib/validations/document';
import z from 'zod';
import Doc from '@/server/models/Document';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const currentCookies = await cookies();
    const activeOrgId = currentCookies.get('activeOrgId')?.value;
    if (!activeOrgId) {
      return NextResponse.json(
        { message: 'No active Organization selected' },
        { status: 400 }
      );
    }
    await connectDB();
    const membership = await OrgMember.findOne({
      orgId: activeOrgId,
      userId: session.user.id,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'Not member of this Organization' },
        { status: 403 }
      );
    }
    const canCreate = canCreateDocument(membership.role);
    if (!canCreate) {
      return NextResponse.json(
        { message: "You don't have permission to create Document" },
        { status: 403 }
      );
    }
    const body = await request.json();
    const result = documentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: z.treeifyError(result.error) },
        { status: 400 }
      );
    }
    const doc = await Doc.create({
      title: result.data.title,
      content: result.data.content,
      authorId: session.user.id,
      orgId: activeOrgId,
    });
    return NextResponse.json(
      { message: 'Document successfully created!', document: doc },
      { status: 201 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
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
    const currentCookies = await cookies();
    const activeOrgId = currentCookies.get('activeOrgId')?.value;
    if (!activeOrgId) {
      return NextResponse.json(
        { message: 'NO active organization selected' },
        { status: 400 }
      );
    }
    await connectDB();
    const membership = await OrgMember.findOne({
      orgId: activeOrgId,
      userId: session.user.id,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'Not member of this organization' },
        { status: 403 }
      );
    }
    const documentsList = await Document.find({ orgId: activeOrgId });
    return NextResponse.json({ documentList: documentsList }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
