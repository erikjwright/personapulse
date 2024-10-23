import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const products = [
  { id: 1, name: "Laptop", price: 1000, description: "High-performance laptop" },
  { id: 2, name: "Headphones", price: 200, description: "Noise-cancelling headphones" },
  { id: 3, name: "Coffee Maker", price: 150, description: "Brew the perfect cup" },
  { id: 4, name: "Running Shoes", price: 120, description: "Comfort and durability" },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p>{product.description}</p>
          <p className="text-lg font-bold">${product.price}</p>
          <Link href={`/product/${product.id}`}>
            <Button className="mt-4">View Details</Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}