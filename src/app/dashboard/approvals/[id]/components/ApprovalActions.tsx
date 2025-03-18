import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { isPending } from '@/app/dashboard/approvals/components/utils';

/**
 * ApprovalActions Component
 * 
 * This component provides action buttons and UI for approving or rejecting a request.
 * It displays differently based on the current status of the request and includes
 * a rejection dialog for capturing rejection reasons.
 * 
 * Features:
 * - Shows approve/reject buttons for pending requests
 * - Displays a status message for already processed requests
 * - Provides a modal dialog for entering rejection reasons
 * - Uses sticky positioning to ensure actions are always visible
 * - Appropriately styled buttons based on action type (approve/reject)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.form - The approval form data
 * @param {string} props.rejectionReason - The current rejection reason text
 * @param {Function} props.setRejectionReason - Function to update rejection reason
 * @param {boolean} props.rejectionDialogOpen - Whether rejection dialog is open
 * @param {Function} props.setRejectionDialogOpen - Function to toggle rejection dialog
 * @param {Function} props.handleApprove - Function to call when approving
 * @param {Function} props.handleReject - Function to call when rejecting
 * @param {boolean} props.loading - Whether data is still loading
 */
interface ApprovalActionsProps {
  form: any;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  rejectionDialogOpen: boolean;
  setRejectionDialogOpen: (open: boolean) => void;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  loading: boolean;
}

export default function ApprovalActions({
  form,
  rejectionReason,
  setRejectionReason,
  rejectionDialogOpen,
  setRejectionDialogOpen,
  handleApprove,
  handleReject,
  loading
}: ApprovalActionsProps) {
  // Don't render anything if data is still loading
  if (loading || !form) {
    return null;
  }

  // Conditionally render based on the approval status
  // Only show actions if the form is pending
  if (!isPending(form.status)) {
    // Show a banner indicating the request has already been processed
    return (
      <div className="sticky bottom-0 p-4 shadow-lg z-10 rounded-md mt-4">
        <div className={`rounded-md p-4 flex items-center border ${
          form.status?.toLowerCase() === 'approved' 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/20' 
            : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20'
        }`}>
          {/* Status icon based on whether approved or rejected */}
          {form.status?.toLowerCase() === 'approved' ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-3" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${
              form.status?.toLowerCase() === 'approved'
                ? 'text-green-800 dark:text-green-400'
                : 'text-red-800 dark:text-red-400'
            }`}>
              This request has been {form.status?.toLowerCase()}.
            </p>
            {/* Only show rejection reason if it exists */}
            {form.rejection_reason && (
              <p className="text-sm text-muted-foreground mt-1">
                Reason: {form.rejection_reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render action buttons for pending requests
  return (
    <>
      {/* Sticky action bar at the bottom of the page */}
      <div className="sticky bottom-0 bg-background border-t p-4 shadow-lg z-10 rounded-t-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Warning message */}
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            <span>Please review the request carefully before taking an action.</span>
          </div>
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Reject button - opens rejection dialog */}
            <Button 
              variant="outline" 
              size="lg"
              className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 sm:w-auto w-full"
              onClick={() => setRejectionDialogOpen(true)}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Reject Request
            </Button>
            {/* Approve button - immediately approves */}
            <Button 
              variant="default" 
              size="lg"
              className="bg-green-600 hover:bg-green-700 sm:w-auto w-full"
              onClick={handleApprove}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Approve Request
            </Button>
          </div>
        </div>
      </div>

      {/* Rejection Dialog - Modal for entering rejection reason */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Reject Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this request. This will be visible to the requester.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[120px]"
              autoFocus
            />
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 