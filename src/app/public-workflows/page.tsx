import type { Metadata } from "next";
import { PublicWorkflowsGallery } from "@/components/workflow/PublicWorkflowsGallery";

export const metadata: Metadata = {
    title: "Public Workflows - FlowForge",
    description:
        "Discover and use public automation workflows created by the community.",
};

export default function PublicWorkflowsPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicWorkflowsGallery />
        </div>
    );
}
