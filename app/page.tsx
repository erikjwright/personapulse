import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const products = [
  { id: 1, name: "Laptop", price: 1000, description: "High-performance laptop" },
  { id: 2, name: "Headphones", price: 200, description: "Noise-cancelling headphones" },
  { id: 3, name: "Coffee Maker", price: 150, description: "Brew the perfect cup of coffee" },
  { id: 4, name: "Running Shoes", price: 120, description: "Comfort and durability for long runs" },
];

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <Link href={`/product/${product.id}`}>
              <Button className="mt-4">View Details</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}