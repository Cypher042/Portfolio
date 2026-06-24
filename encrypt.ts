import { armor, Encrypter } from "age-encryption";

const passphrase =
    prompt("Enter passphrase for encryption:") || Bun.env.PASSPHRASE;
const outputFile = Bun.env.OUTPUT_FILE || "public/data/data.age";

if (!passphrase) {
    throw new Error("Passphrase is required for encryption.");
}

const plaintext = await Bun.file("data.json")
    .json()
    // Minify JSON by removing whitespace
    .then((data) => JSON.stringify(data));

const encrypter = new Encrypter();
encrypter.setPassphrase(passphrase);

const ciphertext = await encrypter.encrypt(plaintext);
const armored = armor.encode(ciphertext);

console.log("Encrypted text:");
console.log(armored);

await Bun.write(outputFile, armored);
console.log(`Encrypted data written to ${outputFile}`);
