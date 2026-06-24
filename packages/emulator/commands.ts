import { BrowserDetector } from "browser-dtector";
import { Inode, InodeFlags, type InodeFunction } from "./filesystem";

export const cd: InodeFunction = ({ fs, shell }, path) => {
    const targetPath = fs.parsePath(path, shell.cwd);

    if (fs.findInodeByPath(targetPath)) {
        shell.stderr(`cd: "${path}" is not a directory`);
        return;
    }

    if (!fs.isPathADirectory(targetPath)) {
        shell.stderr(`cd: The directory "${path}" does not exist`);
        return;
    }

    shell.cwd = targetPath;
};

export const pwd: InodeFunction = ({ fs, shell }) => {
    shell.stdout(fs.formatPath(shell.cwd));
};

export const ls: InodeFunction = ({ fs, shell }, path = ".") => {
    const children = fs.getDirectoryChildren(fs.parsePath(path, shell.cwd));

    if (!children) {
        // Check whether it cannot be found because it is a file
        const inode = fs.findInodeByPath(fs.parsePath(path, shell.cwd));

        if (inode) {
            shell.stdout(fs.formatPath(inode.path));
            return;
        }

        shell.stderr(`ls: Cannot access '${path}': No such file or directory`);
        return;
    }

    // Filter for children that are deeper than one level
    const paths = children
        .map((child) => child.path)
        .map((childPath) => {
            if (childPath.length === fs.parsePath(path, shell.cwd).length + 1) {
                return childPath;
            }

            return childPath.slice(0, fs.parsePath(path, shell.cwd).length + 1);
        })
        // Deduplicate paths
        .filter(
            (value, index, self) =>
                self.findIndex(
                    (v) =>
                        v.join(fs.options.pathSeparator) ===
                        value.join(fs.options.pathSeparator),
                ) === index,
        );

    shell.stdout(paths.map((path) => path.at(-1)).join("\n"));
};

export const cat: InodeFunction = ({ fs, shell }, path) => {
    const inode = fs.findInodeByPath(fs.parsePath(path, shell.cwd));

    if (!inode) {
        if (fs.isPathADirectory(fs.parsePath(path, shell.cwd))) {
            shell.stderr(`cat: ${path}: Is a directory`);
            return;
        }

        shell.stderr(`cat: ${path}: No such file or directory`);
        return;
    }

    shell.stdout(inode.content);
};

export const echo: InodeFunction = ({ shell }, ...args) => {
    shell.stdout(args.join(" "));
};

export const clear: InodeFunction = ({ shell }) => {
    shell.clear();
};

export const touch: InodeFunction = ({ fs, shell }, path) => {
    const targetPath = fs.parsePath(path, shell.cwd);
    const name = targetPath.at(-1) || "";

    if (!name) {
        shell.stderr("touch: missing file operand");
        return;
    }

    if (fs.findInodeByPath(targetPath)) {
        shell.stderr(
            `touch: ${path}: File already exists (this ain't that kind of emulator, bud)`,
        );
        return;
    }

    fs.inodes.push(
        new Inode(targetPath, "", InodeFlags.Read | InodeFlags.Write),
    );
};

export const which: InodeFunction = ({ fs, shell }, command) => {
    const inode = fs.tryResolveExecutable(command);

    if (!inode) {
        shell.stderr(`which: ${command}: command not found`);
        return;
    }

    shell.stdout(fs.formatPath(inode.path));
};

export const neofetch: InodeFunction = ({ shell }) => {
    const detector = new BrowserDetector(
        window.navigator.userAgent,
    ).parseUserAgent();

    const fastfetchText = String.raw`                            cypher@website
    _____  __      __       --------------
   /\___ \/\ \  __/\ \      OS: ${detector.name} ${detector.version}
   \/__/\ \ \ \/\ \ \ \     Host: CypherOS (1.2.4)
      _\ \ \ \ \ \ \ \ \    Kernel: ${detector.platform}
     /\ \_\ \ \ \_/ \_\ \   Uptime: Who knows!
     \ \____/\ \`\___x___/   Packages: 6767 (jacman)
      \/___/  '\/__//__/    Shell: jash 0.22.1
                            Display (${detector.name?.toUpperCase()}): 1920x1080 @ 165 Hz in 16" [Built-in]
                            
Hi, I'm Cypher!
    
I make apps, websites, servers and various pet projects through FOSS and open standards. I am a student in computer engineering and a programmer by passion, with several years of experience in many kinds of fields.

This is an interactive terminal emulator with an emulated filesystem, try using the "help" command!

`.replace("\\`", "`");

    shell.stdout(fastfetchText);
};

export const help: InodeFunction = ({ fs, shell }) => {
    const executables = fs.inodes.filter(
        (inode) => inode.executable && inode.readable,
    );

    if (executables.length === 0) {
        shell.stdout("No commands available.");
        return;
    }

    shell.stdout("Executables detected in the filesystem:");
    shell.stdout(executables.map((inode) => ` - ${inode.name}`).join("\n"));
    shell.stdout("Type the name of a command to execute it.");
};
