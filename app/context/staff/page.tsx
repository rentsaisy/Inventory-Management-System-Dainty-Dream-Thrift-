'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react';

interface Staff {
  user_id: number;
  username: string;
  phone_number?: string;
  address?: string;
  role_name?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 5;

export default function StaffPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Add form states
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newRoleId, setNewRoleId] = useState<string>('2');
  
  // Edit form states
  const [editUsername, setEditUsername] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editRoleId, setEditRoleId] = useState<string>('2');

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

  useEffect(() => {
    if (showEditDialog && selectedStaff) {
      setEditUsername(selectedStaff.username);
      setEditPhone(selectedStaff.phone_number || '');
      setEditAddress(selectedStaff.address || '');
      setEditRoleId(selectedStaff.role_name === 'Admin' ? '1' : '2');
    } else {
      setEditUsername('');
      setEditPhone('');
      setEditAddress('');
      setEditRoleId('2');
    }
  }, [showEditDialog, selectedStaff]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      } else {
        setError('Failed to fetch staff data');
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      alert('Username and password are required');
      return;
    }
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role_id: Number(newRoleId),
          phone_number: newPhone || null,
          address: newAddress || null,
        }),
      });
      if (res.ok) {
        setNewUsername('');
        setNewPassword('');
        setNewPhone('');
        setNewAddress('');
        setNewRoleId('2');
        setShowAddDialog(false);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add staff');
      }
    } catch (error) {
      console.error('Failed to add staff:', error);
      alert('Error adding staff');
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff || !editUsername.trim()) {
      alert('Username is required');
      return;
    }
    try {
      const res = await fetch(`/api/staff?id=${selectedStaff.user_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editUsername,
          phone_number: editPhone || null,
          address: editAddress || null,
          role_id: Number(editRoleId),
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setSelectedStaff(null);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update staff');
      }
    } catch (error) {
      console.error('Failed to edit staff:', error);
      alert('Error updating staff');
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    try {
      const res = await fetch(`/api/staff?id=${selectedStaff.user_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedStaff(null);
        setShowDeleteDialog(false);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete staff');
      }
    } catch (error) {
      console.error('Failed to delete staff:', error);
      alert('Error deleting staff');
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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground mt-2">Manage system users</p>
        </div>
        {user.role === 'admin' && (
          <>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => setShowAddDialog(true)}
            >
              Add Staff
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff</DialogTitle>
                  <DialogDescription>Create a new staff member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <Input
                    placeholder="Address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                  <Select value={newRoleId} onValueChange={setNewRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff}>Add Staff</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>Update staff member information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <Input
              placeholder="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />
            <Select value={editRoleId} onValueChange={setEditRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete "{selectedStaff?.username}"? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardContent className="pt-2">
          {loading ? (
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">Loading staff...</p>
            </div>
          ) : error ? (
            <div className="text-center py-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="overflow-hidden rounded-lg border border-primary/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-primary to-primary/70 border-b border-primary/20 h-10">
                      <TableHead className="font-bold text-primary-foreground w-12 text-sm px-3 py-2">No.</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Username</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Phone</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Address</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2">Role</TableHead>
                      <TableHead className="font-bold text-primary-foreground text-sm px-3 py-2 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStaff.length === 0 ? (
                      <TableRow className="hover:bg-card/50">
                        <TableCell colSpan={6} className="text-center py-4 h-11">
                          <p className="text-muted-foreground text-sm">No staff found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStaff.map((member, index) => (
                        <TableRow key={member.user_id} className="transition-colors border-b border-primary/10 hover:bg-card/50 h-11">
                          <TableCell className="font-semibold text-primary text-sm px-3 py-3">{startIndex + index + 1}</TableCell>
                          <TableCell className="font-medium text-foreground text-sm px-3 py-3">{member.username}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">{member.phone_number || 'N/A'}</TableCell>
                          <TableCell className="text-foreground text-sm px-3 py-3">{member.address || 'N/A'}</TableCell>
                          <TableCell className="text-sm px-3 py-3">
                            <span className={`px-2 py-1 rounded-full inline-block text-xs font-semibold ${
                              member.role_name === 'Admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {member.role_name || 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell className="flex gap-1 px-3 py-3 justify-end">
                            {user?.role === 'admin' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedStaff(member);
                                    setShowEditDialog(true);
                                  }}
                                  title="Edit staff"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedStaff(member);
                                    setShowDeleteDialog(true);
                                  }}
                                  title="Delete staff"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="text-xs text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, staff.length)} of {staff.length} staff members
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 h-8"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-primary text-white' : ''}`}
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
                      className="flex items-center gap-1 h-8"
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
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
