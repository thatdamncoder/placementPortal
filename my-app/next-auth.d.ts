// declare module "next-auth"{
//     interface Session{
//         user: {
//             id?: string
//             role?: "tpo" | "student"
//         } & DefaultSession["user"]
//     }
//     interface User {
//     id: string
//     role?: string
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string
//     role?: string
//   }
// }