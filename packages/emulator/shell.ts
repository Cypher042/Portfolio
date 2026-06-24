import mitt from "mitt";
import type { Filesystem } from "./filesystem";

export class Shell {
    public output = mitt<{
        stdout: string;
        stderr: string;
        deleteLines: number;
        clear: undefined;
    }>();

    constructor(
        public filesystem: Filesystem,
        public cwd: string[] = [""],
    ) {}

    public async executeCommand(
        command: string,
        ...args: string[]
    ): Promise<void> {
        const inode = this.filesystem.tryResolveExecutable(command);

        if (!inode) {
            this.stderr(`Command not found: ${command}`);
            return;
        }

        if (!inode.executable) {
            this.stderr(`Command is not executable: ${command}`);
            return;
        }

        await inode.execute(this, this.filesystem, ...args);
    }

    public stdout(message: string): void {
        if (message.at(-1) !== "\n") {
            this.output.emit("stdout", `${message}\n`);
            return;
        }
        this.output.emit("stdout", message);
    }

    public stderr(message: string): void {
        if (message.at(-1) !== "\n") {
            this.output.emit("stderr", `${message}\n`);
            return;
        }
        this.output.emit("stderr", message);
    }

    public deleteLines(count: number): void {
        this.output.emit("deleteLines", count);
    }

    public clear(): void {
        this.output.emit("clear");
    }
}
