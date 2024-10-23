import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
	const { product } = await req.json();

	const prompt = `Generate a creative and engaging description for a product called "${product.name}" in the "${product.category}" category.`;

	const response = await openai.completions.create({
		model: "gpt-4o",
		prompt,
		max_tokens: 250,
	});

	return NextResponse.json({
		description: response.choices[0].text.trim(),
	});
}
