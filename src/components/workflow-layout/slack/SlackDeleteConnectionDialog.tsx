"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface SlackDeleteConnectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Confirmation dialog for deleting Slack connections
 */
export const SlackDeleteConnectionDialog = React.memo(function SlackDeleteConnectionDialog({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
}: SlackDeleteConnectionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Webhook Connection</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this webhook connection? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});
