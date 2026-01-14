import { Outlet, Link } from 'react-router-dom';
import { Brain, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-error to-warning flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
          </div>
          <Link to="/dashboard/home">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
