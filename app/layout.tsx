import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/app/context/AuthContext'
import { InventoryProvider } from '@/app/context/InventoryContext'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Thrift Store Inventory Management',
  description: 'Cute and aesthetic inventory management system for thrift stores',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <InventoryProvider>
            {children}
          </InventoryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
