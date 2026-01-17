import type { Metadata } from "next";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";

export const metadata: Metadata = {
    title: "My Workflows - FlowForge",
    description:
        "Manage your automation workflows. View, edit, run, and track executions of all your workflows.",
};

export default function WorkflowsPage() {
    return (
        <div className="min-h-screen bg-background">
            <WorkflowDashboard />
        </div>
    );
}
