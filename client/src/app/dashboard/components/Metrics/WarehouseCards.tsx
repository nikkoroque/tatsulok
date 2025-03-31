"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

interface WarehouseCardsProps {
  title: string;
  occupied: number;
  empty: number;
}

export function WarehouseCards({
  title,
  occupied,
  empty,
}: WarehouseCardsProps) {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        <Warehouse className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">In use Locations</p>
        <div className="text-2xl font-bold">{occupied.toFixed(2)}%</div>
        <p className="text-xs text-muted-foreground">
          {empty.toFixed(2)}% empty locations
        </p>
      </CardContent>
    </Card>
  );
}