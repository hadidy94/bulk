import Image from "next/image";
import Link from "../Link";

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import LanguageSwitchLink from '../LanguageSwitchLink'
import i18nextConfig from '../../next-i18next.config'



import { useSession, signOut } from 'next-auth/react';
function Header() {
    const { data: session, status } = useSession();
    // console.log(session)
    function logoutHandler() {
        signOut();
    }

    const router = useRouter()
    const { t } = useTranslation('footer')
    const currentLocale = router.query.locale || i18nextConfig.i18n.defaultLocale



    return (
        <header className="bg-bm-red py-4 px-7 flex justify-between items-center">
            <div className="flex ">
                <Link href="/">
                    <Image
                        src="/images/bm-logo.svg"
                        alt="buildmart-logo-en"
                        width="70"
                        height="40"
                        className="mx-auto"
                    />
                </Link>
            </div>
            {session && (

                <div className="flex text-white gap-x-8">
                    <span>{`Welcome back, ${session.user.full_name} (Vendor Team)`}</span>
                    {/* <span>Last login: Sat, Feb 11, 2023 3:28 PM</span> */}

                    <p>
                        <span style={{ lineHeight: '4.65em', fontSize: 'small' }}>{t('change-locale')}</span>
                        {i18nextConfig.i18n.locales.map((locale) => {
                            if (locale === currentLocale) return null
                            return (
                                <LanguageSwitchLink
                                    locale={locale}
                                    key={locale}
                                />
                            )
                        })}
                    </p>
                    <button onClick={logoutHandler} type="button" className="flex items-center text-white">
                        <Image
                            src="/images/logout.svg"
                            alt="buildmart-logo-en"
                            width="15"
                            height="16"
                            className="mx-auto mr-2"
                        />
                        <span>Logout</span>
                    </button>
                </div>

            )}
        </header>
    );
}

export default Header;