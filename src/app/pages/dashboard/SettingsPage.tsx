import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import { User, CreditCard, Bell, Code } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue="John Doe" className="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue="john@company.com" className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Company Name</Label>
                <Input defaultValue="Company Inc." className="mt-1" />
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Professional Plan</span>
                  <Badge className="bg-success/10 text-success">Active</Badge>
                </div>
                <p className="text-2xl font-bold">€1,500<span className="text-sm text-gray-600">/month</span></p>
                <p className="text-sm text-gray-600 mt-2">Next billing date: February 14, 2026</p>
              </div>
              <Button variant="outline">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Email notifications for new meetings', id: 'email-meetings' },
                { label: 'Campaign completion alerts', id: 'campaign-alerts' },
                { label: 'Weekly performance digest', id: 'weekly-digest' },
                { label: 'AI SDR alerts', id: 'ai-alerts' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id}>{item.label}</Label>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Developers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="password" defaultValue="sk_live_1234567890abcdef" readOnly />
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Keep your API key secure and never share it publicly.</p>
              </div>
              <Button variant="outline">Generate New Key</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
