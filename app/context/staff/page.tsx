'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Staff {
  user_id: number;
  username: string;
  email?: string;
  role_id: number;
  role_name?: string;
}

const ITEMS_PER_PAGE = 5;

export default function StaffPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = staff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground mt-2">Manage system users</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">Add Staff</Button>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
            <CardTitle>Staff List</CardTitle>
            <CardDescription>All staff members in your system ({staff.length} total)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading staff...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/10">
                        <TableHead className="font-bold text-foreground w-12">No.</TableHead>
                        <TableHead className="font-bold text-foreground">Username</TableHead>
                        <TableHead className="font-bold text-foreground">Role</TableHead>
                        <TableHead className="font-bold text-foreground">Email</TableHead>
                        <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStaff.length === 0 ? (
                        <TableRow className="hover:bg-primary/5">
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">No staff found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedStaff.map((member, index) => (
                          <TableRow key={member.user_id} className="hover:bg-primary/5 transition-colors border-b border-primary/10">
                            <TableCell className="font-semibold text-primary">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium">{member.username}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full inline-block text-xs font-semibold ${
                                member.role_id === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {member.role_id === 1 ? 'Admin' : member.role_id === 2 ? 'Staff' : 'Unknown'}
                              </span>
                            </TableCell>
                            <TableCell>{member.email || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, staff.length)} of {staff.length} staff members
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2 px-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'bg-primary text-white' : ''}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
