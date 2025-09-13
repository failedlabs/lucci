import { LandingWrapper } from "@/components/landing-wrapper"
import { SignedOut, SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <LandingWrapper>
      <SignedOut>
        <SignUp />
      </SignedOut>
    </LandingWrapper>
  )
}
