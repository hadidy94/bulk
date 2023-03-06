import { Props } from "next/script";

function AuthLayout({ children }: Props) {
    return (
        <>
            <div className="container mx-auto">
                {children}
            </div>
        </>
    );
}

export default AuthLayout;