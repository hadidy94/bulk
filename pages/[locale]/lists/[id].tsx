import { useState, useEffect, useMemo } from 'react';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient, useQuery, QueryCache } from 'react-query';
import { useRouter } from 'next/router';
import { Button } from '../../../components/UI/Button';
import { getListById } from '@/helpers/api/upload-template';
import ModelUI from '@/components/UI/ModelUI';

import DataTableSec from '../../../components/Content/DataTableSec';
import PageHeader from '../../../components/Layout/PageHeader';
import TabPanel from '@/components/UI/TabPanel';
import { Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';

const { TabPane } = Tabs;





function ListByID() {

  const queryClient = useMemo(() => { return new QueryClient() }, []);
  const { query: { id } } = useRouter();
  const [pageNum, setPageNum] = useState(1);
  const [value, setValue] = useState(0);
  const [statusVal, setstatusVal] = useState('new_product');
  const [openApprovalModel, setOpenApprovalModel] = useState(false);



  const { status, data, isLoading, error, isFetching, isPreviousData, refetch } = useQuery(
    ['lists', id, statusVal, pageNum],
    () => getListById(id, statusVal, pageNum),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 0
    }
  )

  console.log(data);

  const handleTabsChange = (key: number) => {
    switch (key) {
      case 0:
        setPageNum(1);
        setstatusVal('new_product');
        break;
      case 1:
        setPageNum(1);
        setstatusVal('product_exist_in_same_seller');
        break;
      case 2:
        setPageNum(1);
        setstatusVal('product_exist_in_other_seller');
        break;
      default:
        break;
    }
    setValue(key);
  };


  const handlePageClick = (event: Event) => {
    setPageNum(event)
  };


  const handleApprovalModelClose = () => {
    setOpenApprovalModel(false)
  };
  const handleApprovalModelOpen = () => {
    setOpenApprovalModel(true)
  };

  const prefetchData = (event) => {
    if (event) {
      refetch();
    }
  }

  useEffect(() => {
    queryClient.prefetchQuery(['lists', id, statusVal, pageNum], () =>
      getListById(id, statusVal, pageNum)
    )
  }, [statusVal, pageNum, queryClient, id])


  const items: TabsProps['items'] = [
    {
      key: 0,
      label: `New products`,
    },
    {
      key: 1,
      label: `Exist for seller`,
    },
    {
      key: 2,
      label: `Exist other sellers`,
    }
  ];


  return (
    <>
      <h1 className='text-2xl mt-8'>list by id</h1>

      <div className="my-5">
        <PageHeader>
          <Tabs defaultActiveKey={value} value={value} items={items} size="large" onChange={handleTabsChange} />
          <div className='flex gap-5'>
            <Button onClick={handleApprovalModelOpen} className="btn-bm">Submit for approval</Button>
          </div>

        </PageHeader>
      </div>


      <TabPanel value={value} index={value}>
        {isFetching &&
          <div className="text-center p-8">
            <Spin size="large" />
          </div>
        }

        {!isFetching && <DataTableSec data={data} prefetchData={prefetchData} handlePageClick={handlePageClick} />}
      </TabPanel>



      <ModelUI width={'500'} IsModalOpened={openApprovalModel}>
        <h5 className='text-xl text-centermt-5 font-bold text-center'>Submit for Approval</h5>
        <p className='my-4 text-center text-secondary'>Are you sure you want to submit list 123 to HOD for approval?</p>
        <div className='flex gap-4 justify-center align-baseline mt-5'>
          {/* <Button className="btn btn-bm" onClick={() => handleDeleteAction(deletedData.id)}>Yes, submit</Button> */}
          <Button className="btn btn-bm">Yes, submit</Button>
          <a onClick={handleApprovalModelClose} className="btn-secondary-bm p-3">Cancel</a>
        </div>
      </ModelUI>

    </>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });
//   const { id } = context.params;
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery(['list', id], () => getListById(id))

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export default ListByID;