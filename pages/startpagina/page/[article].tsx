import React, { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import classNames from 'classnames';
import { FaAngleLeft } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { DefaultLayout } from '@layouts';
import { Button, Drawer, HamburgerMenu } from '@components';
import { useRefHeight } from '@utils';
import CollectionService from 'utils/service/collectionService';
import { IArticle } from 'utils/service/types';
import ArticleFactory from 'components/article/ArticleFactory';

type ArticlePageProps = {
  title: string;
  homeTitle: string;
  articles: IArticle[];
};

const ArticlePage = ({ title, articles, homeTitle }: ArticlePageProps): JSX.Element => {
  const [showDrawer, setShowDrawer] = React.useState(true);
  const [showContent, setShowContent] = React.useState(false);
  const drawerElement = React.useRef<HTMLDivElement>(null);
  const [drawerHeight] = useRefHeight(drawerElement);
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  React.useEffect(() => {
    if (isLargeScreen || drawerHeight > 0) setShowContent(true);
  }, [drawerHeight, isLargeScreen]);

  const handleDrawerVisibility = () => setShowDrawer(prevState => !prevState);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content='Memoria 2 Site Template - Article' name='description' />
      </Head>

      <Drawer ref={drawerElement} open={showDrawer} onClose={handleDrawerVisibility}>
        <h2 className='mb-6 text-3xl leading-10 text-tertiary capitalize'>{title}</h2>

        <Link href='/startpagina/page'>
          <a>
            <Button startIcon={<FaAngleLeft />} verticalSpacing='small'>
              {homeTitle}
            </Button>
          </a>
        </Link>
      </Drawer>
      {!showDrawer && <HamburgerMenu onClick={handleDrawerVisibility} />}

      <section
        className={classNames({
          'w-full lg:w-8/12': showDrawer,
          'w-full lg:w-full': !showDrawer,
          'block duration-500 transition-all': showContent,
          hidden: !showContent
        })}
        style={{ paddingTop: showDrawer ? `${drawerHeight}px` : '2rem' }}>
        <section className='grid grid-cols-4 my-16 mx-auto w-full lg:w-10/12'>
          <ArticleFactory articles={articles} />
        </section>
      </section>
    </>
  );
};

ArticlePage.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default ArticlePage;

export async function getStaticProps({ params }: { params: { article: string } }) {
  const homeCollection = new CollectionService('home', 'file');
  const pagesCollection = new CollectionService('pages');

  const { meta: homeMeta } = homeCollection.getItem('home_general');
  const { meta: pageMeta } = pagesCollection.getItem(params.article);

  return {
    props: {
      homeTitle: homeMeta.title ?? '',
      title: pageMeta.title ?? '',
      articles: pageMeta.articles ?? []
    }
  };
}

export const getStaticPaths = async () => {
  const pagesCollection = new CollectionService('pages');
  const paths = pagesCollection.getAllPaths().map((paramsPath: { params: { slug: string } }) => {
    return { params: { article: paramsPath.params.slug } };
  });

  return {
    paths,
    fallback: false
  };
};
