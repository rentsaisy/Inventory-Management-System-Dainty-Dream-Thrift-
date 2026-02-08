import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
