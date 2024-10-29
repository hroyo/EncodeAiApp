type CharacterClassText =
    | "Activist"
    | "Scholar"
    | "Nurturer"
    | "Mystic"
    | "Stormchaser"
    | "Survivor";

const predefinedClassesText: Record<CharacterClassText, {
    prompt: string;
}> = {
    Activist: {
        prompt: "Create a short story about a strong-willed individual fighting for justice.",
    },
    Scholar: {
        prompt: "Write about a wise scholar, immersed in books and knowledge.",
    },
    Nurturer: {
        prompt: "Describe a compassionate caretaker surrounded by nature.",
    },
    Mystic: {
        prompt: "Tell the tale of a mysterious figure with magical powers.",
    },
    Stormchaser: {
        prompt: "Narrate the adventures of an adventurous spirit chasing storms.",
    },
    Survivor: {
        prompt: "Explore the journey of a resilient individual who has overcome hardships.",
    },
};

export default predefinedClassesText;
export type { CharacterClassText };
