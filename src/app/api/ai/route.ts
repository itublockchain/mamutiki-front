import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY as string
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the file URL
    const { fileCID } = await request.json();

    // Validate file URL
    if (!fileCID) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 422 }
      );
    }

    // Creating File URL
    const fileURL = process.env.NEXT_PUBLIC_IPFS_SUFFIX + "/" + fileCID;

    // Fetch the file contents
    const fileResponse = await fetch(fileURL);

    // Check if fetch was successful
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 404 }
      );
    }

    // Parse JSON file contents
    const fileContents = await fileResponse.json();

    // Convert file contents to a string for AI analysis
    const fileContentsString = JSON.stringify(fileContents);

    // Generate quality score
    const prompt = `Analyze the following JSON document and provide a reality/quality score from 0 to 100. 
    Consider factors like:
    - Coherence of data
    - Logical consistency
    - Potential for fabrication
    - Detail richness
    
    Return ONLY the numerical score: ${fileContentsString}`;

    const result = await model.generateContent(prompt);
    const score = result.response.text();

    // Return the quality score
    return NextResponse.json(
      {
        score: parseInt(score.trim()),
        length: getWordCount(fileContentsString) * 1000,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      {
        error: "Error processing file",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

function getWordCount(str: string): number {
  // Split the string by spaces and filter out empty strings
  const words = str.split(/\s+/).filter((word) => word.length > 0);
  // Return the length of the filtered array
  return words.length;
}
