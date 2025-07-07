import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full mx-auto p-6 flex flex-col items-center">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
          <CardTitle className="text-5xl font-bold text-gray-800 mb-2">404</CardTitle>
          <CardDescription className="text-lg text-gray-600 mb-2">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-gray-500 mb-6 text-center">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="outline" className="w-full">Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 