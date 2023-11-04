import * as tf from "@tensorflow/tfjs";

export async function loadModel() {
  try {
    const tfjsModel = await tf.loadLayersModel("../../public/model/model.json");
    console.log("Model successfully loaded!");
    return tfjsModel;
  } catch (error) {
    console.error("Error loading the model:", error);
    return null;
  }
}

function preprocessText(sen) {
  console.log(sen);
  // Make all text lowercase
  let sentence = sen.toLowerCase();

  // Keep punctuations and remove other non-alphabetic characters
  sentence = sentence.replace(/[^a-zA-Z\s.!?,']/g, " ");

  // Remove char surrounded by space
  sentence = sentence.replace(/\s+[a-zA-Z]\s+/g, " ");

  // Remove multiple spaces
  sentence = sentence.replace(/\s+/g, " ");

  return sentence;
}

// Fill the array with 0s to match the desired sequence length
// So that all input sequences have the same length
function padSequences(arr, maxlen) {
  const newArr = new Array(maxlen).fill(0);
  arr.forEach((element, index) => {
    newArr[index] = element;
  });
  return newArr;
}

export async function loadTokenizer() {
  try {
    const tokenizer = await fetch("../../public/model/tokenizer.json");
    const tokenizerData = await tokenizer.json();
    console.log("Tokenizer data loaded!");
    return tokenizerData;
  } catch (error) {
    console.error("Error loading the tokenizer:", error);
    return null;
  }
}

function tokenize(text, tokenizer) {
  if (!tokenizer) {
    console.error("Tokenizer data is not available.");
    return [];
  }

  // split the words of the text
  const split_text = text.split(" ");

  const tokens = [];
  split_text.forEach((element) => {
    if (tokenizer[element] !== undefined) {
      tokens.push(tokenizer[element]);
    }
  });

  return tokens;
}

function createSegments(tokenizedTextsArray, segmentLength) {
  // copy the array
  const tokens = tokenizedTextsArray.slice();
  const segments = [];

  while (tokens.length > segmentLength) {
    // get elements from tokens based on segmentLength and push it to the segments array
    segments.push(tokens.splice(0, segmentLength));
  }

  // push the remaining tokens to the segments array or the last segment
  segments.push(tokens);
  return segments;
}

function addArraysElementWise(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error("Arrays must have the same length.");
  }

  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] + arr2[i]);
  }
  return result;
}

export async function predict(text, model, tokenizer) {
  if (!model) {
    console.error("Model is not available.");
    return null;
  }

  if (!tokenizer) {
    console.error("Tokenizer data is not available.");
    return null;
  }

  const emotions = ["joy", "anger", "sadness", "fear", "neutral"];
  const maxlen = 100;

  text = preprocessText(text);
  const tokenizedTexts = tokenize(text, tokenizer);
  console.log(tokenizedTexts, "tokenizedTexts");
  const segments = createSegments(tokenizedTexts, maxlen);
  console.log(segments);

  //get the segment last value and add padding
  // add the padding on the segment function !TODO
  const lastSegment = segments[segments.length - 1];
  const paddedLastSegment = padSequences(lastSegment, maxlen);
  segments[segments.length - 1] = paddedLastSegment;

  let totalEmotionProbability = [0, 0, 0, 0, 0];

  // iterate through the segments and get the probability of each emotion

  for (let s = 0; s < segments.length; s++) {
    const segment = segments[s];
    const inputTensor = tf.tensor2d([segment], [1, maxlen]);
    const predictions = model.predict(inputTensor);
    const flattenedPredictions = Array.from(predictions.dataSync());

    totalEmotionProbability = addArraysElementWise(
      totalEmotionProbability,
      flattenedPredictions
    );
  }

  console.log("totalEmotionProbability :>> ", totalEmotionProbability);
  //get index of the highest number in the totalEmotionProbability
  const maxIndex = totalEmotionProbability.indexOf(
    Math.max(...totalEmotionProbability)
  );

  // return the emotion with the highest probability
  return emotions[maxIndex];
}
