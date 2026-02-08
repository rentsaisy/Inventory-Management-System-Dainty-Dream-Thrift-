'use client';

import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STAFF_MEMBERS = [
  {
    id: '2',
    name: 'Staff Member',
    email: 'staff@thrift.com',
    role: 'staff' as const,
    joinDate: '2024-01-10',
    status: 'active' as const,
    tasksCompleted: 156,
    itemsAdded: 24,
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@thrift.com',
    role: 'staff' as const,
    joinDate: '2024-02-01',
    status: 'active' as const,
    tasksCompleted: 89,
    itemsAdded: 15,
  },
  {
    id: '4',
    name: 'Sarah Smith',
    email: 'sarah@thrift.com',
    role: 'staff' as const,
    joinDate: '2024-01-25',
    status: 'active' as const,
    tasksCompleted: 124,
    itemsAdded: 31,
  },
];

export default function StaffPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your team</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20 p-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <p className="text-muted-foreground text-sm font-semibold">Total Staff</p>
            <p className="text-3xl font-bold text-foreground mt-2">{STAFF_MEMBERS.length}</p>
            <p className="text-xs text-green-600 mt-2">All active</p>
          </Card>

          <Card className="border-primary/20 p-6 bg-gradient-to-br from-accent/20 to-accent/5">
            <p className="text-muted-foreground text-sm font-semibold">Total Tasks</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {STAFF_MEMBERS.reduce((sum, s) => sum + s.tasksCompleted, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Completed this month</p>
          </Card>

          <Card className="border-primary/20 p-6 bg-gradient-to-br from-green-500/20 to-green-500/5">
            <p className="text-muted-foreground text-sm font-semibold">Items Added</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {STAFF_MEMBERS.reduce((sum, s) => sum + s.itemsAdded, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Total contributions</p>
          </Card>
        </div>

        {/* Staff List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {STAFF_MEMBERS.map((member) => (
            <Card
              key={member.id}
              className="border-primary/20 p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold capitalize">
                        {member.role}
                      </span>
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Join Date</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{member.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Tasks Completed</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{member.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Items Added</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{member.itemsAdded}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Performance</p>
                    <p className="text-sm font-semibold text-primary mt-1">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                  View Activity
                </Button>
                <Button variant="outline" className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 bg-transparent">
                  Deactivate
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Activity Log */}
        <Card className="border-primary/20 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Added new item', member: 'Sarah Smith', time: '2 hours ago', icon: '📦' },
              { action: 'Updated inventory', member: 'John Doe', time: '4 hours ago', icon: '📝' },
              { action: 'Completed task', member: 'Staff Member', time: '1 day ago', icon: '✓' },
              { action: 'Added new item', member: 'Sarah Smith', time: '2 days ago', icon: '📦' },
            ].map((log, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-2xl">{log.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{log.action}</p>
                  <p className="text-sm text-muted-foreground">{log.member}</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">{log.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
