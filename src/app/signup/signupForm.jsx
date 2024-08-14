'use client'

import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { registerNewUser } from '@/server-actions/user-registration'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom';
import { LoadingButton } from '@/components/loading-button';

export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <LoadingButton variant='default_full_width' loading={pending}>
            {pending ? '' : 'Create account'}
        </LoadingButton>
    )
}

export function LoadingButtonDemo () {
    return <LoadingButton variant='default_full_width' loading>Sign In</LoadingButton>;
};

export  function SignupForm() {

    const initialState = { message: '', errors: {} }

    const [state, formAction] = useFormState(registerNewUser, initialState)
    const [incorrectPassword, setIncorrectPassword] = useState(false)
    const [incorrectEmail, setIncorrectEmail] = useState(false)
    const [incorrectName, setIncorrectName] = useState(false)

    const [emailTaken, setEmailTaken] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setEmailTaken(false)
        if (state.message === 'Email is already registed') {
            setEmailTaken(true)
        } else if (state.message === 'Please enter a valid email address') {
            setIncorrectEmail(true)
        } else if (state.message === 'Please enter a valid name') {
            setIncorrectName(true)
        } else if (state.message === 'Please type in a valid password') {
            setIncorrectPassword(true)
        }   

        if (state.message === 'Success') {
            router.push('/signin')
        }
    }, [state]) 

    return (
        <>
            <form action={formAction} className="space-y-6">
              <div>
                    <Field>
                        <Label>Email address</Label>
                        <Input name="email" type="email" invalid={((state.errors?.email || incorrectEmail || emailTaken) ? true : false)} required />
                        {state.errors?.email && <ErrorMessage>{state.errors?.email[0]}</ErrorMessage>}
                        {(emailTaken && !state.errors?.email && !state.errors?.password) && <ErrorMessage>This email is already registered</ErrorMessage>}
                    </Field> 
              </div>

              <div>
                    <Field>
                        <Label>Name</Label>
                        <Input name="name" type="text" invalid={((state.errors?.name || incorrectName) ? true : false)} required />
                        {state.errors?.name && <ErrorMessage>{state.errors?.name[0]}</ErrorMessage>}
                    </Field> 
              </div>

              <div>
                    <Field>
                        <Label>Password</Label>
                        <Input name="password" type="password" invalid={((state.errors?.password || incorrectPassword) ? true : false)} required />
                        {state.errors?.password && <ErrorMessage>{state.errors?.password[0]}</ErrorMessage>}
                    </Field>
              </div>

              

             
              <div>
                <SubmitBtn/>
              </div>
            </form>
        </>
    )
}
