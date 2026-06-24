import type { Shell } from "./shell";

export const InodeFlags = {
    Read: 0x1,
    Write: 0x2,
    Execute: 0x4,
};

export type InodeFunction = (
    objects: {
        fs: Filesystem;
        shell: Shell;
    },
    ...args: string[]
) => void | Promise<void>;

export class Inode {
    constructor(
        public path: string[],
        public contents: string | InodeFunction,
        public flags: number = InodeFlags.Read | InodeFlags.Write,
    ) {}

    get name(): string {
        return this.path.at(-1) || "";
    }

    get executable(): boolean {
        return (this.flags & InodeFlags.Execute) !== 0;
    }

    get readable(): boolean {
        return (this.flags & InodeFlags.Read) !== 0;
    }

    get writable(): boolean {
        return (this.flags & InodeFlags.Write) !== 0;
    }

    get content(): string {
        return this.contents?.toString() || "";
    }

    public execute(
        shell: Shell,
        filesystem: Filesystem,
        ...args: string[]
    ): void | Promise<void> {
        if (typeof this.contents === "function") {
            return this.contents(
                {
                    fs: filesystem,
                    shell,
                },
                ...args,
            );
        }

        throw new Error("Cannot execute this inode as JS");
    }
}

export class Filesystem {
    public options: {
        pathSeparator: string;
        caseSensitive: boolean;
    };

    public constructor(
        public inodes: Inode[] = [],
        options: Partial<typeof this.options> = {},
    ) {
        this.options = {
            pathSeparator: options.pathSeparator || "/",
            caseSensitive: options.caseSensitive ?? true,
        };
    }

    /**
     * Converts path segments to lowercase if case sensitivity is off.
     * @param path
     * @returns
     */
    private normalizePath(path: string[]): string[] {
        return path.map((p) =>
            this.options.caseSensitive ? p : p.toLowerCase(),
        );
    }

    /**
     * Finds an inode by its path.
     * This method normalizes the path based on case sensitivity settings.
     * @param path
     * @returns
     */
    public findInodeByPath(path: string[]): Inode | undefined {
        return this.inodes.find(
            (inode) =>
                this.normalizePath(inode.path).join(
                    this.options.pathSeparator,
                ) === this.normalizePath(path).join(this.options.pathSeparator),
        );
    }

    public tryResolveExecutable(name: string): Inode | undefined {
        const normalized = this.options.caseSensitive
            ? name
            : name.toLowerCase();

        return this.inodes.find(
            (inode) => inode.name === normalized && inode.executable,
        ) as Inode | undefined;
    }

    public isPathADirectory(path: string[]): boolean {
        const inode = this.findInodeByPath(path);

        if (inode) {
            return false; // Is a file
        }

        const hasChildren = this.inodes.some(
            (inode) =>
                inode.path.length > path.length &&
                this.normalizePath(inode.path)
                    .slice(0, path.length)
                    .join(this.options.pathSeparator) ===
                    this.normalizePath(path).join(this.options.pathSeparator),
        );

        return hasChildren;
    }

    public getDirectoryChildren(path: string[]): Inode[] | null {
        const inode = this.findInodeByPath(path);

        if (inode) {
            // Is a file
            return null;
        }

        const children = this.inodes.filter(
            (inode) =>
                inode.path.length > path.length &&
                this.normalizePath(inode.path)
                    .slice(0, path.length)
                    .join(this.options.pathSeparator) ===
                    this.normalizePath(path).join(this.options.pathSeparator),
        );

        if (children.length === 0) {
            return null;
        }

        return children;
    }

    public formatPath(path: string[]): string {
        return (
            this.options.pathSeparator + path.join(this.options.pathSeparator)
        );
    }

    public isPathAbsolute(path: string): boolean {
        return path.length > 0 && path[0] === this.options.pathSeparator;
    }

    public parsePath(path: string, cwd: string[]): string[] {
        const segments = path
            .split(this.options.pathSeparator)
            .filter((p) => p.length > 0);

        if (this.isPathAbsolute(path)) {
            return segments;
        }

        return [...cwd, ...segments].reduce<string[]>((acc, segment) => {
            if (segment === "..") {
                acc.pop();
            } else if (segment !== ".") {
                acc.push(segment);
            }

            return acc;
        }, []);
    }
}
