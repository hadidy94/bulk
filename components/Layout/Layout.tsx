import { Props } from "next/script";
import { useSession } from "next-auth/react"
import Header from './Header';

function Layout({ children }: Props) {
    const { data: session, status } = useSession()
    return (
        <div className="bg-light-grey">
            <Header />
            <div className="container w-screen mt-4">
                {children}
            </div>

        </div>
    );
}

export default Layout;