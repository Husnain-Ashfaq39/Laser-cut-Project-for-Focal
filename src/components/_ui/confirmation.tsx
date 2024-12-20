import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/_ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?:string,
  desc?:string,
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onConfirm, onCancel ,title='Are you absolutely sure?',desc=' This action cannot be undone. This will permanently delete the data' }) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
           {desc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction className=' bg-red-500 hover:bg-red-700' onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
