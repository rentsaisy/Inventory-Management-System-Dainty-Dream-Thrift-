'use client';

import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const stats = [
    { label: 'Items Added', value: user.role === 'staff' ? '24' : '0', icon: '📦' },
    { label: 'Tasks Completed', value: user.role === 'staff' ? '156' : '—', icon: '✓' },
    { label: 'Account Status', value: 'Active', icon: '🟢' },
    { label: 'Member Since', value: '2024-01-10', icon: '📅' },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your account</p>
        </div>

        {/* Profile Card */}
        <Card className="border-primary/20 p-8">
          <div className="flex items-start gap-6 mb-8">
            <Avatar className="w-20 h-20 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold capitalize">
                  {user.role}
                </span>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Email Address</p>
                  <p className="text-foreground font-semibold mt-1">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Role</p>
                  <p className="text-foreground font-semibold mt-1 capitalize">{user.role}</p>
                </div>
                {user.role === 'admin' && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-full text-xs font-semibold">
                    Administrator
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Account ID</p>
                  <p className="text-foreground font-mono text-sm mt-1">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Activity Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-primary/20 p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                <p className="text-2xl mb-2">{stat.icon}</p>
                <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
                <p className="text-xl font-bold text-foreground mt-2">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <Card className="border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="text-foreground font-semibold">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="text-foreground font-semibold">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Not enabled</p>
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                Enable
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="text-foreground font-semibold">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about inventory changes</p>
              </div>
              <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="text-foreground font-semibold">Dark Theme</p>
                <p className="text-sm text-muted-foreground">Currently enabled</p>
              </div>
              <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-all" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
