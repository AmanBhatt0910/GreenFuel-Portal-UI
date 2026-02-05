import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrichedApprovalForm } from "./interfaces";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

/**
 * ApprovalTracker Component
 *
 * This component displays a visual representation of an approval request's progress
 * through different approval levels, highlighting the current stage.
 *
 * @param {Object} props - Component props
 * @param {Array<EnrichedApprovalForm>} props.forms - The approval forms to display
 */
interface ApprovalTrackerProps {
  forms: EnrichedApprovalForm[];
}

export default function ApprovalTracker({ forms }: ApprovalTrackerProps) {
  if (!forms || forms.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Approval Status Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <p className="text-muted-foreground">No approvals to track</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Approval Status Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {forms.map((form) => (
          <div key={form.id} className="border rounded-md p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div>
                <h3 className="font-semibold flex items-center">
                  <span className="text-primary">{form.id}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span>{form.user_name || form.user}</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {form.department_name || form.department} •{" "}
                  {form.approval_category}
                </p>
              </div>

              <div className="flex items-center">
                <Badge
                  variant={
                    form.status?.toLowerCase() === "approved"
                      ? "default"
                      : form.status?.toLowerCase() === "rejected"
                        ? "destructive"
                        : "outline"
                  }
                  className={`${
                    form.status?.toLowerCase() === "pending"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/20 dark:text-amber-400"
                      : form.status?.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/20 dark:text-green-400"
                        : ""
                  }`}
                >
                  {form.status?.toLowerCase() === "approved" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : form.status?.toLowerCase() === "rejected" ? (
                    <XCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {form.status}
                </Badge>
              </div>
            </div>

            {/* Progress tracker */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Level {form.current_form_level} of {form.form_max_level}
                </span>
              </div>

              <div className="relative">
                {/* Track base */}
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full"></div>

                {/* Progress indicator */}
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full ${
                    form.status?.toLowerCase() === "approved"
                      ? "bg-green-500"
                      : form.status?.toLowerCase() === "rejected"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                  style={{
                    width: `${
                      form.status?.toLowerCase() === "approved"
                        ? "100"
                        : form.status?.toLowerCase() === "rejected"
                          ? ((form.current_form_level - 1) /
                              form.form_max_level) *
                            100
                          : (form.current_form_level / form.form_max_level) *
                            100
                    }%`,
                  }}
                ></div>

                {/* Level indicators */}
                <div className="flex justify-between items-center w-full absolute top-4">
                  {Array.from({ length: form.form_max_level }, (_, index) => {
                    const levelNumber = index + 1;
                    const isCompleted = form.current_form_level > levelNumber;
                    const isCurrent = form.current_form_level === levelNumber;
                    const isRejected =
                      form.status?.toLowerCase() === "rejected" && isCurrent;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center mt-1"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isRejected
                              ? "bg-red-100 border-2 border-red-500 dark:bg-red-900/30"
                              : isCompleted
                                ? "bg-green-500 dark:bg-green-600"
                                : isCurrent
                                  ? "bg-blue-100 border-2 border-blue-500 dark:bg-blue-900/30"
                                  : "bg-gray-100 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                          }`}
                        >
                          {isCompleted && (
                            <CheckCircle className="h-2 w-2 text-white" />
                          )}
                          {isRejected && (
                            <XCircle className="h-2 w-2 text-red-500" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1 ${
                            isRejected
                              ? "text-red-500 font-medium"
                              : isCurrent
                                ? "text-blue-500 font-medium"
                                : isCompleted
                                  ? "text-green-500 font-medium"
                                  : "text-gray-500"
                          }`}
                        >
                          Level {levelNumber}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Approval path */}
              <div className="mt-12 pt-1 flex items-center space-x-2 text-sm"></div>

              {/* Additional details about the current level */}
              <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-800/50 p-3 text-sm">
                {form.status?.toLowerCase() === "approved" ? (
                  <p className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    This request has been fully approved.
                  </p>
                ) : form.status?.toLowerCase() === "rejected" ? (
                  <p className="text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    This request was rejected at level {form.current_form_level}
                    .
                    {form.rejection_reason && (
                      <span className="ml-1">
                        Reason: {form.rejection_reason}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-blue-600 dark:text-blue-400 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    This request is currently awaiting approval at level{" "}
                    {form.current_form_level} (
                    {form.current_form_level === 1
                      ? "Team Lead"
                      : form.current_form_level === 2
                        ? "Manager"
                        : form.current_form_level === 3
                          ? "Director"
                          : "CFO"}
                    ).
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
