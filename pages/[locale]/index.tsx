import { useEffect, useState, useMemo,useCallback } from "react";
import { getSession } from 'next-auth/react';
import { bulkUploadList } from '../../helpers/api/upload-template';
import { useQuery, QueryClient, QueryCache } from 'react-query';

import Box from '@mui/material/Box';
import DownloadButton from '../../components/Content/DownloadBtn';
import UploadBtn from '../../components/Content/UploadBtn';
import PageHeader from '../../components/Layout/PageHeader';
import TabPanel from '../../components/UI/TabPanel';
import BulkListsTable from '../../components/Content/BulkListsTable';

import { Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
const { TabPane } = Tabs;




import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '../../lib/getStatic';


const getStaticProps = makeStaticProps(['common', 'footer']);
export { getStaticPaths, getStaticProps }




const HomePage = () => {

  const { t } = useTranslation('common')

  const queryClient = useMemo(()=> {return new QueryClient()}, []);
  const [value, setValue] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [statusVal, setstatusVal] = useState('draft')


  const { data, error, isFetching, refetch } = useQuery(
    ['lists', statusVal, pageNum],
    () => bulkUploadList(statusVal, pageNum),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 0
    }
  )


  const handleTabsChange = (key: number) => {
    switch (key) {
      case 0:
        setstatusVal('draft');
        setPageNum(1);
        break;
      case 1:
        setstatusVal('inprogress');
        setPageNum(1);
        console.log('inprogress')
        break;
      default:
        break;
    }
    setValue(key);
  };


  const handlePageClick = (page: number) => {
    setPageNum(page)

  };

  const prefetchData = (event) => {
    if (event) {
      refetch();
    }
  }

  useEffect(() => {
    queryClient.prefetchQuery(['lists', statusVal, pageNum], () =>
      bulkUploadList(statusVal, pageNum)
    )
  }, [statusVal, pageNum, queryClient])



  const items: TabsProps['items'] = [
    {
      key: 0,
      label: `All lists`,
    },
    {
      key: 1,
      label: `In progress`,
    }
  ];



  return (
    <>
      <h2 className='font-bold my-5 text-xl'>
      {t('to-second-page')} <br/>
        Products Catalog
      </h2>
      <PageHeader>
        <Tabs defaultActiveKey={value} value={value} items={items} size="large" onChange={handleTabsChange} />
        <div className='flex gap-5'>
          <DownloadButton />
          <UploadBtn prefetchData={prefetchData} />
        </div>

      </PageHeader>


      <Box className='mt-10'>
        <TabPanel value={value} index={value}>
          {isFetching &&
            <div className="text-center p-8">
              <Spin size="large" />
            </div>
          }
          {!isFetching &&
            <BulkListsTable data={data} prefetchData={prefetchData} handlePageClick={handlePageClick} />
          }
        </TabPanel>
        
      </Box>

    </>
  )
}


// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

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
//       session
//     },
//   };
// }


export default HomePage;
