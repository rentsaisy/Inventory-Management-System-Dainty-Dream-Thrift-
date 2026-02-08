'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Staff {
  user_id: number;
  username: string;
  email?: string;
  role_id: number;
  role_name?: string;
}

export default function StaffPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff');
      if (res.ok) {
        setStaff(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
            <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground mt-2">Manage system users</p>
          </div>
          <Button>Add Staff</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff List</CardTitle>
            <CardDescription>All staff members in your system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading staff...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No staff found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      staff.map((member) => (
                        <TableRow key={member.user_id}>
                          <TableCell className="font-medium">{member.username}</TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {member.role_id === 1 ? 'Admin' : member.role_id === 2 ? 'Staff' : 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell>{member.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
