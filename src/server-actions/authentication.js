'use server'

import { signIn, signOut } from "@/auth"

export async function doSocialLogin(formData) {
    const action = formData.get('action')
    await signIn(action, {redirectTo : "/dashboard"})
   
}

export async function doLogout() {
    await signOut({redirectTo : "/signin"})

}

export async function doCredentialLogin(formData) {
    //console.log("formData", formData);
  
    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      console.log("response is ", response)
      return response;
    } catch (err) {
      throw err;
    }
  }