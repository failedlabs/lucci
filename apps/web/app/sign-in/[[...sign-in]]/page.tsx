import { LandingWrapper } from "@/components/landing-wrapper"
import { SignedOut, SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <LandingWrapper>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </LandingWrapper>
  )
}
