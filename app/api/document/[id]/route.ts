import Doc from '@/server/models/Document';
import connectDB from '@/server/db/mongoose';
import { auth } from '@/auth';
import OrgMember from '@/server/models/OrgMember';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { canCreateDocument, canEditContent } from '@/lib/permission';
import type { IContributor } from '@/server/models/Document';
import { documentSchema } from '@/lib/validations/document';
import z from 'zod';

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

export async function PUT(
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
      orgId: activeOrgId,
      userId: session.user.id,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'Not member of this Organization' },
        { status: 403 }
      );
    }
    const orgPermission = canEditContent(membership.role);
    if (!orgPermission) {
      return NextResponse.json(
        { message: 'No permission to edit content' },
        { status: 403 }
      );
    }
    const curDoc = await Doc.findOne({ _id: id, orgId: activeOrgId });
    if (!curDoc) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    const isAuthor = curDoc.authorId.toString() === session.user.id;
    const isContributor = curDoc.contributors.some(
      (contributor: IContributor) =>
        contributor.userId.toString() === session.user?.id
    );
    const hasEditAccess = (isAuthor || isContributor) && orgPermission;
    if (!hasEditAccess) {
      return NextResponse.json(
        { message: 'NO permission to edit Document' },
        { status: 403 }
      );
    }
    const body = await request.json();
    const result = documentSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: z.treeifyError(result.error) },
        { status: 400 }
      );
    }
    const newDoc = await Doc.findByIdAndUpdate(
      id,
      { ...result.data },
      { new: true }
    );
    return NextResponse.json(
      { message: 'Document successfully Updated', updatedDoc: newDoc },
      { status: 200 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: 'Something Went Wrong!' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      orgId: activeOrgId,
      userId: session.user.id,
    });
    if (!membership) {
      return NextResponse.json(
        { message: 'Not member of this Organization' },
        { status: 403 }
      );
    }
    const canDelete = canCreateDocument(membership.role);
    if (!canDelete) {
      return NextResponse.json(
        { message: 'No permission to delete document' },
        { status: 403 }
      );
    }
    const curDoc = await Doc.findOne({ _id: id, orgId: activeOrgId });
    if (!curDoc) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    await Doc.findByIdAndDelete(id);
    return NextResponse.json(
      { message: 'Document successfully deleted' },
      { status: 200 }
    );
  } catch (_) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
