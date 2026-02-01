import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, Shirt, Watch, Zap } from "lucide-react";

interface TopProductsProps {
  products: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string | null;
  }[];
}

 const getIcon = (category: string) => {
    if (category.toLowerCase().includes('electron')) return <Laptop className="h-5 w-5" />;
    if (category.toLowerCase().includes('cloth') || category.toLowerCase().includes('apparel')) return <Shirt className="h-5 w-5" />;
    if (category.toLowerCase().includes('jewelry') || category.toLowerCase().includes('watch')) return <Watch className="h-5 w-5" />;
    return <Zap className="h-5 w-5" />;
  }


export function TopProducts({ products }: TopProductsProps) {
 
  return (
    <Card className="col-span-full lg:col-span-3 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-medium text-muted-foreground">Product</TableHead>
              <TableHead className="font-medium text-muted-foreground hidden lg:table-cell">Category</TableHead>
              <TableHead className="text-right font-medium text-muted-foreground">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-none hover:bg-zinc-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-md overflow-hidden flex items-center justify-center border border-border/50 ${product.image ? 'bg-slate-100' : 'bg-slate-100 text-slate-500'}`}>
                      {getIcon(product.category)}
                    </div>
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{product.category}</TableCell>
                <TableCell className="text-right font-bold text-foreground">${product.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
