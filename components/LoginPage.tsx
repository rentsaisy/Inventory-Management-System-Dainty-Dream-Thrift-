'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="w-full max-w-md">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4l8-4M7 11l8 4m0 0l8-4M7 11v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Thrift Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage your store with ease</p>
        </div>

        <Card className="p-8 border-2 border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-600">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@thrift.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-card border-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-card border-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-8 border-t border-primary/20">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="bg-card/50 p-3 rounded-md">
                <p className="font-mono">Admin: admin@thrift.com</p>
                <p className="font-mono">Password: admin123</p>
              </div>
              <div className="bg-card/50 p-3 rounded-md">
                <p className="font-mono">Staff: staff@thrift.com</p>
                <p className="font-mono">Password: staff123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
