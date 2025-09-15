import { LandingWrapper } from "@/components/landing-wrapper"
import { SignedOut, SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <SignedOut>
      <SignIn />
    </SignedOut>
  )
}
