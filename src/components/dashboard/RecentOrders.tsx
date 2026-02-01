import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RecentOrdersProps {
  orders: {
    totalPrice: number;
    createdAt: Date;
    id: number;
    externalId: number | null;
    userId: number;
    status: string;
    syncedAt: Date;
  }[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Delivered' ? 'default': 'secondary'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
