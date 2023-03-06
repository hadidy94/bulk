import { useState, useEffect, useCallback } from 'react';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient, useQuery, QueryCache } from 'react-query';
import { getProductById } from '@/helpers/api/products';
import { useRouter } from 'next/router';
import UnitTable from '@/components/Content/UnitTable';




function ProductByID() {
    const queryClient = new QueryClient();
    const { query: { id } } = useRouter();


    const { data, isLoading, error, isFetching, refetch } = useQuery(
        ['lists', id],
        () => getProductById(id),
        {
            refetchOnWindowFocus: true,
            refetchInterval: 0
        }
    )


    // console.log(data);
    if (isFetching) {
        return <p>Loading...</p>
    }

    return (
        <>
            {data && (
                <div>
                    <div className="bg-white p-8 mt-8">
                        <h3 className="text-xl">{data.payload.name_en}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-5">
                            <div className="divide-y divide-gray space-y-3">
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">BM-Code</span>
                                    <span className="">__</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">Category</span>
                                    <span className="">{data.payload.category}</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">Brand</span>
                                    <span className="">{data.payload.brand}</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">Model</span>
                                    <span className="">{data.payload.model}</span>
                                </div>
                            </div>
                            <div className="col-span-1 lg:col-span-2 divide-y divide-gray space-y-3">
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">English Description</span>
                                    <span className="">{data.payload.description_en}</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">Arabic Description</span>
                                    <span className="">{data.payload.description_ar}</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">English Keywords</span>
                                    <span className="">{data.payload.keywords_en}</span>
                                </div>
                                <div className='flex justify-between items-center pt-3'>
                                    <span className="font-bold">Arabic Keywords</span>
                                    <span className="">{data.payload.keywords_ar}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl mt-8 mb-4">Selling Units</h3>
                    <div className="bg-white p-8">
                        <UnitTable tableData={ data.payload.units } />
                    </div>
                </div>
                )
            }
        </>
    );
}

// export async function getServerSideProps(context) {
//     const session = await getSession({ req: context.req });
//     const { id } = context.params;
//     const queryClient = new QueryClient()

//     await queryClient.prefetchQuery(['list', id], () => getListById(id))

//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/login',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             session,
//             dehydratedState: dehydrate(queryClient),
//         },
//     };
// }

export default ProductByID;