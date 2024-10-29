"use server";

import path from "node:path";
import { openAsBlob } from "node:fs";
import { writeFileSync } from "node:fs";
import { Livepeer } from "@livepeer/ai";
import { revalidatePath } from "next/cache";


type BodyGenLLM = {
  prompt: string;
  modelId?: string | undefined;
  systemMsg?: string | undefined;
  temperature?: number | undefined;
  maxTokens?: number | undefined;
  history?: string | undefined;
  stream?: boolean | undefined;
}

const livepeerAI = new Livepeer({
  httpBearer: "",
});




export async function textToImage(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const modelId = formData.get("modelId") as string;
  const width = parseInt(formData.get("width") as string);
  const height = parseInt(formData.get("height") as string);
  const guidanceScale = parseFloat(formData.get("guidanceScale") as string);
  const negativePrompt = formData.get("negativePrompt") as string;
  const safetyCheck = formData.get("safetyCheck") === "true";
  const seed = parseInt(formData.get("seed") as string);
  const numInferenceSteps = parseInt(
    formData.get("numInferenceSteps") as string,
  );
  const numImagesPerPrompt = parseInt(
    formData.get("numImagesPerPrompt") as string,
  );
  const result = await livepeerAI.generate.textToImage({
    modelId,
    prompt,
    width,
    height,
    guidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
  });

  revalidatePath("/");

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}

export async function imageToImage(formData: FormData) {
  const image = formData.get("image") as File;
  const buffer = await image.arrayBuffer();
  const publicDir = path.join(process.cwd(), "public");
  const imagePath = path.join(publicDir, image.name);

  writeFileSync(imagePath, Buffer.from(buffer));

  const prompt = formData.get("prompt") as string;
  const modelId = formData.get("modelId") as string;
  const strength = parseFloat(formData.get("strength") as string);
  const guidanceScale = parseFloat(formData.get("guidanceScale") as string);
  const imageGuidanceScale = parseFloat(
    formData.get("imageGuidanceScale") as string,
  );
  const negativePrompt = formData.get("negativePrompt") as string;
  const safetyCheck = formData.get("safetyCheck") === "true";
  const seed = parseInt(formData.get("seed") as string);
  const numInferenceSteps = parseInt(
    formData.get("numInferenceSteps") as string,
  );
  const numImagesPerPrompt = parseInt(
    formData.get("numImagesPerPrompt") as string,
  );

  const result = await livepeerAI.generate.imageToImage({
    image: await openAsBlob(imagePath),
    modelId,
    prompt,
    strength,
    guidanceScale,
    imageGuidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
  });

  revalidatePath("/");

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}

export async function segmentAnything(formData: FormData) {
  const image = formData.get("image") as File;
  const buffer = await image.arrayBuffer();
  const publicDir = path.join(process.cwd(), "public");
  const imagePath = path.join(publicDir, image.name);

  writeFileSync(imagePath, Buffer.from(buffer));

  const modelId = formData.get("modelId") as string;
  const pointCoords = formData.get("pointCoords") as string;  // Pass coordinates in the format required
  const pointLabels = formData.get("pointLabels") as string;  // Pass labels
  const box = formData.get("box") as string;  // Optional bounding box for segmentation

  try {
    const result = await livepeerAI.generate.segmentAnything2({
      image: await openAsBlob(imagePath),
      modelId,
      pointCoords,
      pointLabels,
      box,
      multimaskOutput: true,
      returnLogits: true,
      normalizeCoords: true,
    });

    revalidatePath("/");

    // Assuming only one mask is returned
    // const maskUrl = result.masksResponse?.masks[0];  // Directly access the first mask as a string
    const mask = result.masksResponse?.masks;  // Assuming 'masks' is a string
    const score = result.masksResponse?.scores;  // Assuming 'scores' is a string
    const logits = result.masksResponse?.logits;  // Assuming 'logits' is a string

    return {
      success: !!mask,  // Return true if the mask is defined
      mask: mask || null,  // Return the mask or null if undefined
      score: score || null,  // Return the score or null if undefined
      logits: logits || null,  // Return the logits or null if undefined
    };
  } catch (error) {
    console.error("Error during image segmentation:", error);
    return {
      success: false,
      mask: null,
      error: "Failed to segment image due to an API error.",
    };
  }
}

// Livepeer LLM text generation
export async function textToText(formData: FormData) {
  try {
    // Extract the necessary fields from the FormData object
    const prompt = formData.get("prompt") as string;
    const modelId = formData.get("modelId") as string || 'gpt-3.5';
    const systemMsg = formData.get("systemMsg") as string || '';
    const temperature = parseFloat(formData.get("temperature") as string || '0.7');
    const maxTokens = parseInt(formData.get("maxTokens") as string || '256');
    const history = formData.get("history") as string || '[]';  // History remains a string
    const stream = formData.get("stream") === "true";  // Boolean for stream

    // Construct the BodyGenLLM object
    const requestBody: BodyGenLLM = {
      prompt,
      modelId,
      systemMsg,
      temperature,
      maxTokens,
      history,  // Already a string
      stream,
    };

    // Pass the constructed object to the LLM API
    // const response = await livepeerAI.generate.llm(formData);
    const response = await livepeerAI.generate.llm(requestBody);

    console.log("Request body passed to API:", requestBody);
    return response; // Return the API response
  } catch (error) {
    console.error("Error during text generation:", error);
    return { success: false, error: "Failed to generate text due to an API error." };
  }
}