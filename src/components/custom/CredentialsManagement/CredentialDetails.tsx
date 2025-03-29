"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Credential, CredentialDetailsProps } from "./types";
import {
  Mail,
  Phone,
  UserCheck,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { useMemo } from "react";

export function CredentialDetails({
  selectedUser,
  onClose,
  onEdit,
  onReset,
  designations,
  departments,  
  businessUnits,
}: CredentialDetailsProps) {
  if (!selectedUser) return null;

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500 ">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">{status || "Unknown"}</Badge>;
    }
  };

  const designationMap = useMemo(() => {
    const map = new Map<number, string>();
    designations.forEach(designation => {
      map.set(designation.id, designation.name); 
    });
    return map;
  }, [designations]);

  const departmentMap = useMemo(() => {
    const map = new Map<number, string>();
    departments.forEach(department => {
      map.set(department.id, department.name);
    });
    return map;
  }, [departments]);

  const businessUnitMap = useMemo(() => {
    const map = new Map<number, string>();
    businessUnits.forEach(unit => {
      map.set(unit.id, unit.name);
    });
    return map;
  }, [businessUnits]);

  const getDesignationName = (id: number | null) => {
    if (id === null) return '-';
    return designationMap.get(id) || '-';
  };

  const getBusinessUnitName = (id: number | null) => {
    if (id === null) return '-';
    return businessUnitMap.get(id) || '-';
  };

  const getDepartmentName = (id: number | null) => {
    if (id === null) return '-';
    return departmentMap.get(id) || '-';
  };


  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const renderDetailItem = (
    icon: React.ReactNode,
    label: string,
    value: string | React.ReactNode
  ) => (
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex-shrink-0 mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-medium mt-0.5">{value || "N/A"}</div>
      </div>
    </div>
  );

  return (
    <Card className="w-full overflow-hidden border dark:bg-gray-900">
      <CardHeader className="bg-muted/40 pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl font-semibold">
            {selectedUser.name || "Unnamed Employee"}
          </CardTitle>
          <div>{selectedUser.status}</div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span>{selectedUser.email || "No email"}</span>
          </div>
          {selectedUser.contact && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{selectedUser.contact}</span>
            </div>
          )}
          {selectedUser.department && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{getDepartmentName(selectedUser.department)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-base mb-4">
              Employee Information
            </h3>

            {renderDetailItem(
              <Users className="h-4 w-4" />,
              "Department",
              getDepartmentName(selectedUser.department)
            )}

            {renderDetailItem(
              <UserCheck className="h-4 w-4" />,
              "Designation",
              getDesignationName(selectedUser.designation)
            )}

            {renderDetailItem(
              <Users className="h-4 w-4" />,
              "Business Unit",
              getBusinessUnitName(selectedUser.business_unit)
            )}

            {selectedUser.dob &&
              renderDetailItem(
                <Calendar className="h-4 w-4" />,
                "Date of Birth",
                formatDate(selectedUser.dob)
              )}
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">
              Contact Information
            </h3>

            {renderDetailItem(
              <Mail className="h-4 w-4" />,
              "Email Address",
              selectedUser.email || "N/A"
            )}

            {selectedUser.contact &&
              renderDetailItem(
                <Phone className="h-4 w-4" />,
                "Contact Number",
                selectedUser.contact
              )}

            {(selectedUser.address ||
              selectedUser.city ||
              selectedUser.state ||
              selectedUser.country) &&
              renderDetailItem(
                <MapPin className="h-4 w-4" />,
                "Address",
                <div>
                  {selectedUser.address && <div>{selectedUser.address}</div>}
                  {(selectedUser.city || selectedUser.state) && (
                    <div>
                      {[selectedUser.city, selectedUser.state]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {selectedUser.country && <div>{selectedUser.country}</div>}
                </div>
              )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={() => onReset(selectedUser.email)}>
            Reset Password
          </Button>
          <Button onClick={() => onEdit(selectedUser)}>Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
