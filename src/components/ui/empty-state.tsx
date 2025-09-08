import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-6 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      <Button onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}