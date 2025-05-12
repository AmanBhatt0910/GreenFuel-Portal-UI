import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Loader2, User, Calendar, Phone } from 'lucide-react';

interface PersonalInfoSectionProps {
  userData: any;
  updateUserData: (data: any) => Promise<void>;
  updating: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  userData, 
  updateUserData,
  updating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    dob: userData?.dob || '',
    contact: userData?.contact || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || '',
      dob: userData?.dob || '',
      contact: userData?.contact || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Personal Information
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
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your contact number"
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.name || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userData?.dob ? new Date(userData.dob).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                <p className="text-gray-900 dark:text-white font-medium">{userData?.contact || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;