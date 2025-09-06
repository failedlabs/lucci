import { SignedOut, SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <SignedOut>
      <SignUp />
    </SignedOut>
  )
}
