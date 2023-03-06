import { Props } from "next/script";

function PageHeader({ children }: Props) {

    return (
        <div className="bg-white shadow-sm py-6 px-6 mt-6 flex flex-wrap items-center justify-between">
            {children}
        </div>
    );
}

export default PageHeader;