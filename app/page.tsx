import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const topics = ['sports', 'technology', 'fashion'];

export default function Home() {
  const [userTopic, setUserTopic] = useState<string | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<string[]>([]);

  // Mock training data based on user preferences
  const trainingData = tf.tensor2d([
    [1, 0, 0], // sports
    [0, 1, 0], // technology
    [0, 0, 1], // fashion
  ]);

  const outputData = tf.tensor2d([
    [1], // sports
    [0], // technology
    [2], // fashion
  ]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 3, activation: 'softmax' }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  useEffect(() => {
    model.fit(trainingData, outputData, { epochs: 50 }).then(() => {
      console.log('Model trained');
    });
  }, []);

  const handleTopicClick = async (topic: string) => {
    const userInput = tf.tensor2d([topics.map(t => (t === topic ? 1 : 0))]);
    const prediction = model.predict(userInput) as tf.Tensor;

    // Simulate content recommendation based on the topic
    const recommendations = topics.filter((_, index) => {
      const predictedIndex = prediction.argMax(1).dataSync()[0];
      return index === predictedIndex;
    });

    setUserTopic(topic);
    setRecommendedContent(recommendations);
  };

  return (
    <div>
      <h1>AI-Powered Personalization</h1>
      <p>Select your preferred content topic:</p>
      {topics.map((topic) => (
        <button key={topic} onClick={() => handleTopicClick(topic)}>
          {topic}
        </button>
      ))}

      {userTopic && (
        <div>
          <h2>Recommended content for "{userTopic}"</h2>
          <ul>
            {recommendedContent.map((content) => (
              <li key={content}>{content} articles</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}