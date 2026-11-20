import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient()

export { authClient }
export const { signIn, signUp, useSession, signOut, signOutAll, client, server } = authClient
