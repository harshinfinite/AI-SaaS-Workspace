'use client';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Organization } from '@/types/Organization';
const WorkspaceSwitcher = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      try {
        const response = await fetch('/api/organizations');
        const data = await response.json();
        if (data.organizations) {
          setOrgs(data.organizations);
        }
      } catch (_) {
        console.error('failed to fetch organizations');
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const handleSwitch = async (orgId: string) => {
    try {
      const Response = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId }),
      });
      if (!Response.ok) {
        console.error('Failed to fetch Organizations');
        return;
      }
      setActiveOrgId(orgId);
    } catch (_) {
      console.error('Something Went Wrong ! try again');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Switch Workspace</Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>your Workspace</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {orgs.length === 0 ? (
            <p>No Organizations found</p>
          ) : (
            orgs.map((org) => {
              return (
                <button key={org._id} onClick={() => handleSwitch(org._id)}>
                  {org.name}
                </button>
              );
            })
          )}
        </div>
        <SheetFooter>
          <Button>Create Organization</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WorkspaceSwitcher;
