import {
    Filesystem,
    Inode,
    InodeFlags,
    type InodeFunction,
    Shell,
} from "@cypher/emulator";
import {
    cat,
    cd,
    clear,
    echo,
    help,
    ls,
    neofetch,
    pwd,
    touch,
    which,
} from "@cypher/emulator/commands";
import { defineStore } from "pinia";
import Uwuifier from "uwuifier";
import { applyFnToTextNodes, swearWordify } from "~/utils/vivziepop";

const formatPrompt = (
    cwd: string[],
    formatPath: (path: string[]) => string,
): string => {
    const isHome = cwd.length === 2 && cwd[0] === "home" && cwd[1] === "cypher";
    return isHome
        ? "[root@website ~]$ "
        : `[root@website ${formatPath(cwd)}]$ `;
};

const createBadAppleCommand =
    (scrollToBottom: () => void): InodeFunction =>
    async ({ shell }) => {
        shell.stdout("Loading frames...");

        const VERTICAL_RES = 26;
        const FPS = 1;

        const frameText = await fetch("/ascii/badapple.txt").then((res) =>
            res.text(),
        );
        const audio = new Audio("/audio/bad-apple.mp3");

        await new Promise((resolve) => {
            audio.addEventListener("canplaythrough", resolve);
        });
        audio.play();

        const chunkByLines = (text: string, height: number): string[] => {
            const lines = text.split("\n");
            const chunks: string[] = [];

            for (let i = 0; i < lines.length; i += height) {
                chunks.push(lines.slice(i, i + height).join("\n"));
            }

            return chunks;
        };

        const frames = chunkByLines(frameText, VERTICAL_RES);

        for (const frame of frames) {
            shell.stdout(frame);
            await nextTick();
            scrollToBottom();
            await new Promise((resolve) => setTimeout(resolve, 1000 / FPS));
            shell.deleteLines(VERTICAL_RES + 1);
            await nextTick();
        }
    };

// Inode factory for reducing boilerplate
const createExecutableInode = (path: string[], fn: InodeFunction): Inode =>
    new Inode(path, fn, InodeFlags.Read | InodeFlags.Execute);
const createFileInode = (path: string[], content: string): Inode =>
    new Inode(path, content, InodeFlags.Read | InodeFlags.Write);

export const useCliStore = defineStore("cli", () => {
    // State
    const output = ref("");
    const isInitialized = ref(false);
    const commandHistory = ref<string[]>([]);
    const historyIndex = ref(-1);
    const currentInput = ref("");
    const isProcessing = ref(false);

    // Internal refs for DOM interaction callbacks
    const scrollToBottomFn = ref<() => void>(() => {});

    // Create filesystem with all commands
    const createFilesystem = (): Filesystem => {
        const standardCommands: [string, InodeFunction][] = [
            ["ls", ls],
            ["cat", cat],
            ["cd", cd],
            ["echo", echo],
            ["pwd", pwd],
            ["touch", touch],
            ["neofetch", neofetch],
            ["fastfetch", neofetch],
            ["help", help],
            ["which", which],
            ["clear", clear],
        ];

        const customCommands: [string, InodeFunction][] = [
            [
                "exit",
                () => {
                    window.location.href = "https://google.com";
                },
            ],
            [
                "uwu",
                ({ shell }) => {
                    const uwuifier = new Uwuifier();
                    applyFnToTextNodes((t) => uwuifier.uwuifySentence(t));
                    shell.stdout("uwu owo awa");
                },
            ],
            [
                "vivziepop",
                ({ shell }) => {
                    applyFnToTextNodes((t) => swearWordify(t));
                    shell.stdout("Me if I was written by Vivziepop 🤯");
                },
            ],
            ["badapple", createBadAppleCommand(() => scrollToBottomFn.value())],
        ];

        const commandInodes = [
            ...standardCommands.map(([name, fn]) =>
                createExecutableInode(["usr", "bin", name], fn),
            ),
            ...customCommands.map(([name, fn]) =>
                createExecutableInode(["usr", "bin", name], fn),
            ),
        ];

        const fileInodes = [
            createFileInode(
                ["home", "cypher", "hello.txt"],
                "Hi, I'm Cypher!\n\nI make apps, websites and servers through FOSS and open standards. I am a student in computer engineering and a programmer by passion, with several years of experience in many kinds of fields.",
            ),
        ];

        return new Filesystem([...commandInodes, ...fileInodes]);
    };

    // Create shell instance
    const filesystem = createFilesystem();
    const shell = new Shell(filesystem, ["home", "cypher"]);

    // Computed
    const prompt = computed(() =>
        formatPrompt(shell.cwd, filesystem.formatPath.bind(filesystem)),
    );

    // Event handlers
    const handleStdout = async (message: string) => {
        output.value += message;
    };
    const handleClear = (): void => {
        output.value = "";
    };
    const handleDeleteLines = (count: number): void => {
        const lines = output.value.split("\n");
        output.value = `${lines.slice(0, -count).join("\n")}\n`;
    };

    // Actions
    const executeCommand = async (
        command: string,
        args: string[] = [],
    ): Promise<void> => {
        isProcessing.value = true;
        // Append prompt + command to output
        await handleStdout(`${prompt.value}${command} ${args.join(" ")}\n`);
        await shell.executeCommand(command, ...args);
        isProcessing.value = false;
    };

    const parseAndExecuteCommand = async (input: string): Promise<void> => {
        const trimmed = input.trim();
        if (trimmed) {
            commandHistory.value.push(trimmed);
        }
        historyIndex.value = -1;
        currentInput.value = "";

        const [command = "", ...args] = trimmed.split(" ");
        await executeCommand(command, args);
    };

    const navigateHistory = (
        direction: "up" | "down",
        getCurrentInput: () => string,
    ): string => {
        const history = commandHistory.value;

        if (history.length === 0) {
            return getCurrentInput();
        }

        if (direction === "up") {
            if (historyIndex.value === -1) {
                currentInput.value = getCurrentInput();
                historyIndex.value = history.length - 1;
            } else if (historyIndex.value > 0) {
                historyIndex.value--;
            }
            return history[historyIndex.value] ?? "";
        }

        // direction === "down"
        if (historyIndex.value === -1) {
            return getCurrentInput();
        }

        if (historyIndex.value < history.length - 1) {
            historyIndex.value++;
            return history[historyIndex.value] ?? "";
        }

        // At the end of history, restore current input
        historyIndex.value = -1;
        return currentInput.value;
    };

    const initialize = async (): Promise<void> => {
        if (isInitialized.value) return;

        shell.output.on("stdout", handleStdout);
        shell.output.on("stderr", handleStdout);
        shell.output.on("clear", handleClear);
        shell.output.on("deleteLines", handleDeleteLines);

        output.value = "";
        isInitialized.value = true;
    };

    const cleanup = async (): Promise<void> => {
        await shell.executeCommand("clear");

        shell.output.off("stdout", handleStdout);
        shell.output.off("stderr", handleStdout);
        shell.output.off("clear", handleClear);
        shell.output.off("deleteLines", handleDeleteLines);
    };

    const setScrollToBottom = (fn: () => void): void => {
        scrollToBottomFn.value = fn;
    };

    return {
        // State
        output,
        isInitialized,
        commandHistory,
        isProcessing,

        // Computed
        prompt,

        // Actions
        initialize,
        cleanup,
        parseAndExecuteCommand,
        navigateHistory,
        setScrollToBottom,
    };
});
