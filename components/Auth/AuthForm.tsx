import { useState, useRef, useCallback } from 'react';
import { signIn, SignInResponse } from "next-auth/react"
import { useRouter } from 'next/router';
import toast from "../Toast";
import Image from "next/image";

function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const notify = useCallback((type: string, message: string) => {
        toast({ type, message });
    }, []);

    const dismiss = useCallback(() => {
        toast.dismiss();
    }, []);


    async function submitHandler(event: any) {
        event.preventDefault();
        setIsLoading(true);
        dismiss()
        const enteredEmail = emailInputRef.current?.value;
        const enteredPassword = passwordInputRef.current?.value;
        
        const result: SignInResponse | any = await signIn('credentials', {
            redirect: false,
            email: enteredEmail,
            password: enteredPassword,
        });
        if (result.status != 200) {
            notify("error", "Email or Password is invalid")
            setIsLoading(false);
            setIsLoading(false);
            return false;
        }
        if (!result.error) {
            setIsLoading(false);
            router.replace('/');
        }
    }
    return (
        <>
            <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
                <div className="w-full py-10 px-8 m-auto bg-white rounded-md shadow-md border-top lg:max-w-[45%]">
                    <div className="text-center">
                        <Image
                            src="/images/buildmart-logo-en.svg"
                            alt="buildmart-logo-en"
                            width="100"
                            height="50"
                            className="mx-auto mb-3"
                        />
                        <h3 className="text-2xl fw-extrabold">Welcome Back!</h3>
                        <p className="text-muted small">Sign in to account</p>
                    </div>

                    <form className="mt-6" onSubmit={submitHandler}>
                        <div className="relative floating-input mb-8">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                className="w-full 
                                pt-10
                                pb-7
                                px-4
                                h-10 text-gray-900 
                                rounded
                                placeholder-transparent 
                                border 
                                border-gray 
                                peer 
                                focus:outline-none 
                                focus:border-bm-red"
                                placeholder="john@doe.com"
                                ref={emailInputRef}
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-4
                                 top-2 
                                 text-gray-400 
                                 text-[12px] 
                                 transition-all 
                                 peer-placeholder-shown:text-base 
                                 peer-placeholder-shown:text-gray-400 
                                 peer-placeholder-shown:top-5
                                 peer-focus:top-2   
                                 peer-focus:text-gray-400 
                                 peer-focus:text-[12px]"
                            >
                                Email address *
                            </label>
                        </div>
                        <div className="relative mb-8">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="w-full 
                                        pt-10
                                        pb-7
                                        px-4
                                        h-10 text-gray-900 
                                        rounded
                                        placeholder-transparent 
                                        border 
                                        border-gray 
                                        peer 
                                        focus:outline-none 
                                        focus:border-bm-red"
                                placeholder="john@doe.com"
                                ref={passwordInputRef}
                                required
                            />
                            <label
                                htmlFor="Password"
                                className="absolute left-4
                               top-2 
                               text-gray-400 
                               text-[12px] 
                               transition-all 
                               peer-placeholder-shown:text-base 
                               peer-placeholder-shown:text-gray-400 
                               peer-placeholder-shown:top-5
                               peer-focus:top-2   
                               peer-focus:text-gray-400 
                               peer-focus:text-[12px]"
                            >
                                Password *
                            </label>
                        </div>
                        <div className="mt-6">
                            <button
                                className="w-full
                                 tracking-wide
                                 btn btn-bm
                                    text-lg
                                    px-4
                                    py-5
                                 "
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Login"}

                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AuthForm;
