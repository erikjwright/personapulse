import * as tf from "@tensorflow/tfjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1000 },
  { id: 2, name: "Headphones", category: "Accessories", price: 200 },
  { id: 3, name: "Coffee Maker", category: "Home Appliances", price: 150 },
  { id: 4, name: "Running Shoes", category: "Sports", price: 120 },
];

const productCategories = ["Electronics", "Accessories", "Home Appliances", "Sports"];

export default function ProductDetail() {
  const { id } = useParams();
  const [recommendedProducts, setRecommendedProducts] = useState<{ id: number; name: string; category: string; price: number; }[]>([]);

  const product = products.find((p) => p.id === Number.parseInt(id as string));

  useEffect(() => {
    if (product) {
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [4], units: 4, activation: "softmax" }));
      model.compile({ loss: "meanSquaredError", optimizer: "adam" });

      const userPreferences = tf.tensor2d([
        [1, 0, 0, 0], // Prefers Electronics
        [0, 1, 0, 0], // Prefers Accessories
        [0, 0, 1, 0], // Prefers Home Appliances
        [0, 0, 0, 1], // Prefers Sports
      ]);
      
      const outputPreferences = tf.tensor2d([[1], [0], [2], [3]]); // Matching categories to users

      model.fit(userPreferences, outputPreferences, { epochs: 50 }).then(() => {
        const userInput = tf.tensor2d([[1, 0, 0, 0]]); // Simulate user likes electronics
        const prediction = model.predict(userInput) as tf.Tensor;
        const predictedCategoryIndex = prediction.argMax(1).dataSync()[0];
        const recommended = products.filter((p) => p.category === productCategories[predictedCategoryIndex]);
        setRecommendedProducts(recommended);
      });
    }
  }, [product]);

  return (
    <div className="p-4">
      {product ? (
        <>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p>${product.price}</p>

          <h2 className="text-xl mt-8">Recommended Products:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedProducts.map((prod) => (
              <Card key={prod.id} className="p-4">
                <h2>{prod.name}</h2>
                <p>${prod.price}</p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}