import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface DeleteButtonProps {
  onDelete: () => void;
  resource: 'products' | 'categories' | 'suppliers' | 'users' | 'transactions';
  variant?: "outline" | "destructive";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function DeleteButton({ 
  onDelete, 
  resource,
  variant = "destructive",
  size = "sm",
  className 
}: DeleteButtonProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('delete', resource)) {
    return null;
  }

  return (
    <Button 
      onClick={onDelete}
      variant={variant}
      size={size}
      className={className}
    >
      Delete
    </Button>
  );
}