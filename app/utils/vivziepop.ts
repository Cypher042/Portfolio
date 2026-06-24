const swearWords = [
    "bitch",
    "bastard",
    "fuck",
    "cunt",
    "asshole",
    "cum",
    "whore",
];

const getRandomSwearWord = (): string =>
    swearWords[Math.floor(Math.random() * swearWords.length)] as string;

/**
 * Replace a text with swear words that end up roughly the same length
 * as the original text.
 * @param text
 * @returns
 */
export const swearWordify = (text: string) => {
    let newText = "";

    while (newText.length < text.length) {
        const randomSwearWord = getRandomSwearWord();

        if (newText === "") {
            newText = randomSwearWord;
        } else {
            newText += ` ${randomSwearWord}`;
        }
    }

    // Remove the last word if it is too long
    if (newText.length > text.length) {
        const lastSpaceIndex = newText.lastIndexOf(" ");
        if (lastSpaceIndex !== -1) {
            newText = newText.slice(0, lastSpaceIndex);
        }
    }

    return newText;
};

const getAllDOMTextNodes = (): Node[] => {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
    );

    const nodes: Node[] = [];

    while (true) {
        const newNode = walker.nextNode();

        if (!newNode) {
            break;
        }

        nodes.push(newNode);
    }

    return nodes;
};

export const applyFnToTextNodes = (fn: (text: string) => string) => {
    const nodes = getAllDOMTextNodes();

    for (const node of nodes) {
        const text = node.nodeValue;

        if (text) {
            const newText = fn(text);
            node.nodeValue = newText;
        }
    }
};
