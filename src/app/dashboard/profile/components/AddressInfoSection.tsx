import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, X, Loader2, MapPin, Globe, Building2, Landmark, Navigation } from 'lucide-react';

interface AddressInfoSectionProps {
  userData: any;
  updateUserData: (data: any) => Promise<void>;
  updating: boolean;
}

const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({ 
  userData, 
  updateUserData,
  updating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: userData?.address || '',
    city: userData?.city || '',
    state: userData?.state || '',
    country: userData?.country || '',
    postalCode: userData?.postalCode || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || '',
      postalCode: userData?.postalCode || '',
    });
    setIsEditing(false);
  };

  const hasAddressInfo = userData?.address || userData?.city || userData?.state || userData?.country;

  return (
    <Card className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Address Information
            </CardTitle>
          </div>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
                disabled={updating}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubmit}
                disabled={updating}
                className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isEditing ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                  Street Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 min-h-[100px] text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                  City
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    placeholder="New York"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">
                  State/Province
                </Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="pl-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    placeholder="NY"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-gray-700 dark:text-gray-300">
                  Postal Code
                </Label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="pl-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    placeholder="10001"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
                  Country
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="pl-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {hasAddressInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData?.address && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Address</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.address}
                      </p>
                    </div>
                  </div>
                )}
                
                {userData?.city && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.city}
                      </p>
                    </div>
                  </div>
                )}
                
                {userData?.state && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <Navigation className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">State/Province</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.state}
                      </p>
                    </div>
                  </div>
                )}
                
                {userData?.postalCode && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <Landmark className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Postal Code</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.postalCode}
                      </p>
                    </div>
                  </div>
                )}
                
                {userData?.country && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Country</h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {userData.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <MapPin className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No address information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                  You haven't added any address details yet. Click the edit button to add your address information.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressInfoSection;