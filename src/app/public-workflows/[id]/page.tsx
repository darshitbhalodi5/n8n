import { PublicWorkflowPreview } from "@/components/workflow/PublicWorkflowPreview";

export default async function PublicWorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <PublicWorkflowPreview workflowId={id} />
    </div>
  );
}
