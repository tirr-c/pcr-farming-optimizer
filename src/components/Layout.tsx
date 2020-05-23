import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function Layout(props: Props) {
  const titleData = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  const defaultTitle: string = titleData.site.siteMetadata.title;
  const title = props.title ? `${props.title} - ${defaultTitle}` : defaultTitle;
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <React.Suspense fallback={<div>Loading...</div>}>
        {props.children}
      </React.Suspense>
    </>
  );
}
