import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Loader2, Mail, Calendar, Shield, UserCog } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleType } from '@/lib/roles';

interface AccountInfoSectionProps {
  userData: any;
  updateUserData: (data: any) => Promise<void>;
  updating: boolean;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ 
  userData, 
  updateUserData,
  updating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: userData?.email || '',
    username: userData?.username || '',
    role: userData?.role || '',
    is_budget_requester: userData?.is_budget_requester || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      email: userData?.email || '',
      username: userData?.username || '',
      role: userData?.role || '',
      is_budget_requester: userData?.is_budget_requester || false,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Account Information
        </CardTitle>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4 text-indigo-600" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="h-8 w-8 p-0"
              disabled={updating}
            >
              <X className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Cancel</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSubmit}
              className="h-8 w-8 p-0"
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
              ) : (
                <Save className="h-4 w-4 text-indigo-600" />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="APPROVER">APPROVER</SelectItem>
                    <SelectItem value="MD">MD</SelectItem>
                    <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_budget_requester">Budget Requester</Label>
                <p className="text-sm text-gray-500">Allow user to request budgets</p>
              </div>
              <Switch
                id="is_budget_requester"
                checked={formData.is_budget_requester}
                onCheckedChange={(checked) => handleSwitchChange('is_budget_requester', checked)}
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.username || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <UserCog className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userData?.role || 'Not assigned'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(userData?.date_joined)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permissions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData?.is_staff 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    Staff: {userData?.is_staff ? 'Yes' : 'No'}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData?.is_budget_requester 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    Budget Requester: {userData?.is_budget_requester ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountInfoSection;