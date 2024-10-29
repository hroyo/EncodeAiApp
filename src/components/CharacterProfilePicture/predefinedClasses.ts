type CharacterClass =
    | "Activist"
    | "Scholar"
    | "Nurturer"
    | "Mystic"
    | "Stormchaser"
    | "Survivor";

const predefinedClasses: Record<CharacterClass, {
    prompt: string;
    modelId: string;
    width: number;
    height: number;
    guidanceScale: number;
    negativePrompt: string;
    safetyCheck: boolean;
    numInferenceSteps: number;
    numImagesPerPrompt: number;
}> = {
    Activist: {
        prompt: "A young woman asian american or half asian, with one side short hair and piece of blue hair, with a tranquilizer gun looking straigth at me defiant, with a slight celluloid film texture image.",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
    Scholar: {
        prompt: "A natural-looking, realistic, middle-aged Black man secret agent, with mysterious headphones around his neck, in a harsh archaeological landscape and dramatic weather, wearing reading glasses and dressed in an elegant British tweed dark green suit, with a subtle celluloid film texture to the image.",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
    Nurturer: {
        prompt: "A natural-looking 38-year-old Asian-Arabic woman with a determined and adventurous expression, working as a medical rescuer in a harsh landscape with dramatic weather conditions, with a slight celluloid film texture.",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
    Mystic: {
        prompt: "A natural-looking middle-aged woman with short hair, grey eyes, and a scary presence, wearing a white technical winter jacket. With slight celluloid film texture image.",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
    Stormchaser: {
        prompt: "A defiant adventurer with short hair, green eyes, and a couple of days old beard, standing in a dramatic desert tornado storm,  wearing a worn flannel jacket  holding a modern DSLR camera. The image has a slight celluloid texture for a subtle vintage cinematic feel",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
    Survivor: {
        prompt: "A middle-aged hispanic man, messy style haircut, wearing a black jacket, with a resilient look, symbolizing someone who has overcome hardships, in amazon-like landscape and black rifle in his back, with a subtle celloid texture image.",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    },
};

export default predefinedClasses;
export type { CharacterClass };
