import { Building } from "lucide-react";
import React from "react";

const OrganizationalSection: React.FC<{
  request: any;
  getUserName: (id: number) => string;
  getEntityName: (map: Map<number, any>, id: number) => string;
  businessUnitMap: Map<number, any>;
  departmentMap: Map<number, any>;
}> = React.memo(
  ({ request, getUserName, getEntityName, businessUnitMap, departmentMap }) => (
    <div className="bg-amber-50 p-5 rounded-lg border border-sky-100">
      <h3 className="font-medium text-amber-800 mb-4 text-lg flex items-center">
        <Building className="h-5 w-5 mr-2 text-amber-600" />
        Organizational Details
      </h3>
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-md border border-amber-100">
          <p className="text-sm font-medium text-amber-700">Requester</p>
          <p className="text-base text-gray-900 mt-1">
            {getUserName(request.user)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-amber-100">
          <p className="text-sm font-medium text-amber-700">Business Unit</p>
          <p className="text-base text-gray-900 mt-1">
            {getEntityName(businessUnitMap, request.business_unit)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-amber-100">
          <p className="text-sm font-medium text-amber-700">Department</p>
          <p className="text-base text-gray-900">
            {getEntityName(departmentMap, request.department)}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-amber-100">
          <p className="text-sm font-medium text-amber-700">
            Initiating Department
          </p>
          <p className="text-base text-gray-900">
            {request.initiate_dept
              ? getEntityName(departmentMap, request.initiate_dept)
              : "Same as Department"}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md border border-amber-100">
          <p className="text-sm font-medium text-amber-700">Notify To</p>
          <p className="text-base text-gray-900">
            {request.notify_to ? getUserName(request.notify_to) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
);

OrganizationalSection.displayName = "OrganizationalSection";

export default OrganizationalSection;
