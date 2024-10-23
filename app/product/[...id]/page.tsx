"use client";

import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation"; // Import useParams

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1000 },
  { id: 2, name: "Headphones", category: "Accessories", price: 200 },
  { id: 3, name: "Coffee Maker", category: "Home Appliances", price: 150 },
  { id: 4, name: "Running Shoes", category: "Sports", price: 120 },
];

const productCategories = ["Electronics", "Accessories", "Home Appliances", "Sports"];

export default function ProductDetail() {
  const { id } = useParams(); // Use useParams to get the dynamic id
  const productId = id ? Number.parseInt(Array.isArray(id) ? id[0] : id, 10) : Number.NaN;
  const product = products.find((p) => p.id === productId);

  const [recommendedProducts, setRecommendedProducts] = useState<{ id: number; name: string; category: string; price: number; }[]>([]);

  useEffect(() => {
    if (product) {
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [4], units: 4, activation: "softmax" }));
      model.compile({ loss: "meanSquaredError", optimizer: "adam" });

      // Simulate user preferences for 4 categories (Electronics, Accessories, etc.)
      const userPreferences = tf.tensor2d([
        [1, 0, 0, 0], // Prefers Electronics
        [0, 1, 0, 0], // Prefers Accessories
        [0, 0, 1, 0], // Prefers Home Appliances
        [0, 0, 0, 1], // Prefers Sports
      ]);

      const outputPreferences = tf.tensor2d([[1], [0], [2], [3]]); // Output categories

      model.fit(userPreferences, outputPreferences, { epochs: 50 }).then(() => {
        // Simulate that the user prefers electronics (could be dynamic based on the product viewed)
        const userInput = tf.tensor2d([[1, 0, 0, 0]]); // Prefers Electronics
        
        const prediction = model.predict(userInput) as tf.Tensor;
        const predictedCategoryIndex = prediction.argMax(1).dataSync()[0];

        // Filter recommended products based on predicted category
        const recommended = products.filter(
          (p) => productCategories[predictedCategoryIndex] === p.category
        );
        setRecommendedProducts(recommended);
      });
    }
  }, [product]);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p>${product.price}</p>
      <Button className="mt-4">Add to Cart</Button>

      <h2 className="text-xl mt-8">Recommended Products:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedProducts.map((prod) => (
          <Card key={prod.id} className="p-4">
            <h2>{prod.name}</h2>
            <p>${prod.price}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}