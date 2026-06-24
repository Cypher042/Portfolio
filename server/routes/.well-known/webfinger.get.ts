export default defineEventHandler(() => {
    const email = "ayush200501@gmail.com";
    const issuer = "https://id.cypher.com/realms/default";
    const avatar = "https://cypher.com/images/avatars/ayushk.png";

    return {
        subject: `acct:${email}`,
        links: [
            {
                rel: "http://openid.net/specs/connect/1.0/issuer",
                href: issuer,
            },
            {
                rel: "avatar",
                type: "image/png",
                href: avatar,
            },
        ],
    };
});
