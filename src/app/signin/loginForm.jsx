'use client'

import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { doCredentialLogin } from '@/server-actions/authentication'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom';
import { LoadingButton } from '@/components/loading-button';

export function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <LoadingButton variant='default_full_width' loading={pending}>
            {pending ? '' : 'Sign in'}
        </LoadingButton>
    )
}

export function LoadingButtonDemo () {
    return <LoadingButton variant='default_full_width' loading>Sign In</LoadingButton>;
};

export  function LoginForm() {

    const initialState = { message: '', errors: {} }
    const [state, formAction] = useFormState(doCredentialLogin, initialState)
    const [userDoesNotExist, setUserDoesNotExist] = useState(false)
    const [incorrectPassword, setIncorrectPassword] = useState(false)
    const [otherSignError, setOtherSignError] = useState(false)
    const router = useRouter()

    useEffect(() => {
        console.log(state.message)
        setUserDoesNotExist(false)
        setIncorrectPassword(false)
        setOtherSignError(false)
       if (state.message === 'Success') {
            router.push('/dashboard')
       } else if (state.message === ' User not found') {
            setUserDoesNotExist(true)
            setOtherSignError(false)
            setIncorrectPassword(false)
       } else if (state.message === ' Password is not correct') {
            setIncorrectPassword(true)
            setUserDoesNotExist(false)
            setOtherSignError(false)
       } else if ( state.message ) {
            setOtherSignError(true)
            setIncorrectPassword(false)
            setUserDoesNotExist(false)
       }
    }, [state])

    return (
        <>
            <form action={formAction} className="space-y-6">
                <div>
                    <div className="mt-2">
                        <Field>
                            <Label>Email address</Label>
                            <Input name="email" type="email" invalid={(state.errors?.email || userDoesNotExist) ? true : false} required />
                            {state.errors?.email && <ErrorMessage>{state.errors?.email[0]}</ErrorMessage>}
                            {userDoesNotExist && <ErrorMessage>This email is not registered</ErrorMessage>}
                        </Field>
                        
                    </div>
                </div>

                <div>
                    <Field>
                        <Label>Password</Label>
                        <Input name="password" type="password" invalid={(state.errors?.password || incorrectPassword) ? true : false} required />
                        {state.errors?.password && <ErrorMessage>{state.errors?.password[0]}</ErrorMessage>}
                        {incorrectPassword && <ErrorMessage>Incorrect password</ErrorMessage>}
                        
                        { (otherSignError && !state.errors?.password && !state.errors?.email) && <ErrorMessage>Something went wrong, try again.</ErrorMessage>}
                    </Field>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm leading-6">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div>
                   <SubmitBtn/>
                </div>
            </form>
        </>
    )
}
