// declare module "next-auth"{
//     interface Session{
//         user: {
//             id?: string
//             role?: "admin" | "student"
//         } & DefaultSession["user"]
//     }
//     interface jwt{
//         id?: string,
//         role?: "admin" | "student"
//     }
// }