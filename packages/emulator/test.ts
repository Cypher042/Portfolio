import { cat, cd, echo, ls, pwd } from "./commands";
import { Filesystem, Inode, InodeFlags } from "./filesystem";
import { Shell } from "./shell";

const demoFileSystem = new Filesystem([
    new Inode(["usr", "bin", "ls"], ls, InodeFlags.Read | InodeFlags.Execute),
    new Inode(["usr", "bin", "cat"], cat, InodeFlags.Read | InodeFlags.Execute),
    new Inode(["usr", "bin", "cd"], cd, InodeFlags.Read | InodeFlags.Execute),
    new Inode(
        ["usr", "bin", "echo"],
        echo,
        InodeFlags.Read | InodeFlags.Execute,
    ),
    new Inode(["usr", "bin", "pwd"], pwd, InodeFlags.Read | InodeFlags.Execute),
]);

const shell = new Shell(demoFileSystem, ["usr"]);

shell.executeCommand("cd", "/");
shell.executeCommand("pwd");
