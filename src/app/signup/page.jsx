
import { doSocialLogin } from "@/server-actions/authentication";
import Link from "next/link";
import { SignUpForm } from "./signupForm"

export default function Page() {

  return (
    <>
      <SignUpForm />
    </>
  )
}
