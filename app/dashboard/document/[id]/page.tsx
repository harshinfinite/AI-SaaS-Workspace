import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/server/db/mongoose';
import OrgMember from '@/server/models/OrgMember';
import Doc from '@/server/models/Document';
import DocEditor from '@/components/features/documents/DocumentEditor';

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect('/login');
  }
  const curCookies = await cookies();
  const activeOrgId = curCookies.get('activeOrgId')?.value;
  if (!activeOrgId) {
    redirect('/dashboard');
  }
  await connectDB();
  const member = await OrgMember.findOne({
    orgId: activeOrgId,
    userId: session.user.id,
  });
  if (!member) {
    notFound();
  }
  const document = await Doc.findOne({ _id: id, orgId: activeOrgId });
  if (!document) {
    notFound();
  }
  const plainDoc = {
    ...document.toObject(),
    _id: document._id.toString(),
    authorId: document.authorId.toString(),
    orgId: document.orgId.toString(),
  };
  return (
    <>
      <DocEditor document={plainDoc}></DocEditor>
    </>
  );
}
