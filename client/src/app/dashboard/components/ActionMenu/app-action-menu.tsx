import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ActionMenuProps<T> = {
  row: T; // Generic type for the row
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
  idKey: keyof T; // Key to determine the ID field dynamically
  resource: 'products' | 'categories' | 'suppliers' | 'users' | 'transactions';
};

const ActionMenu = <T,>({
  row,
  onEdit,
  onDelete,
  idKey,
  resource,
}: ActionMenuProps<T>) => {
  const { user } = useAuth();
  
  const handleEdit = () => {
    onEdit(row); // Pass the row to the edit handler
  };

  const handleDelete = () => {
    const id = row[idKey] as unknown as number; // Extract ID dynamically
    onDelete(id);
  };

  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleEdit}>
            Edit
            <DropdownMenuShortcut>
              <Pen className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {canDelete && (
            <DropdownMenuItem onClick={handleDelete}>
              Delete
              <DropdownMenuShortcut>
                <Trash className="w-4 h-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;