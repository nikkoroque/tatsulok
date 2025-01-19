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

type ActionMenuProps<T> = {
  row: T; // Generic type for the row
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
  idKey: keyof T; // Key to determine the ID field dynamically
};

const ActionMenu = <T,>({
  row,
  onEdit,
  onDelete,
  idKey,
}: ActionMenuProps<T>) => {
  const handleEdit = () => {
    onEdit(row); // Pass the row to the edit handler
  };

  const handleDelete = () => {
    const id = row[idKey] as unknown as number; // Extract ID dynamically
    onDelete(id);
  };
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
          <DropdownMenuItem onClick={handleDelete}>
            Delete
            <DropdownMenuShortcut>
              <Trash className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;