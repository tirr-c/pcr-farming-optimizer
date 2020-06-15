import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import React from 'react';
import { Helmet } from 'react-helmet';

const Ui = styled('main')`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template:
    't t'
    'a c'
    'b c' 1fr
    'f f'
    / 1fr 1fr;
  grid-gap: 16px;
  gap: 16px;

  @media (max-width: 1200px + 16px * 2) {
    grid-template:
      't t'
      'a c'
      'b c' 1fr
      'f f'
      / 1fr 600px;
  }

  @media (max-width: 1000px) {
    grid-template: 't' 'a' 'b' 'c' 'f' / 100%;
    grid-auto-rows: auto;
  }

  > h1 {
    grid-area: t;
  }

  > section:nth-of-type(1) {
    grid-area: a;
  }

  > section:nth-of-type(2) {
    grid-area: b;
  }

  > section:nth-of-type(3) {
    grid-area: c;
  }

  > footer {
    grid-area: f;
  }
`;

const Title = styled('h1')`
  font-size: 28px;
  font-weight: bold;
`;

const Footer = styled('footer')`
  font-size: 14px;
  color: gray;
`;

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function Layout(props: Props) {
  const intl = useIntl();
  const defaultTitle: string = intl.formatMessage({ id: 'title' });
  const title = props.title ? `${props.title} - ${defaultTitle}` : defaultTitle;
  const fansiteNotice = intl.formatMessage(
    { id: 'fansite-notice.base' },
    {
      cite: (
        <cite>{intl.formatMessage({ id: 'fansite-notice.cite' })}</cite>
      ),
      link: (
        <a href="https://priconne-redive.jp">
          {intl.formatMessage({ id: 'fansite-notice.link' })}
        </a>
      ),
    },
  );
  return (
    <Ui>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Title>{defaultTitle}</Title>
      <React.Suspense fallback={<section>{intl.formatMessage({ id: 'loading.generic' })}</section>}>
        {props.children}
      </React.Suspense>
      <Footer>
        <p>{fansiteNotice}</p>
      </Footer>
    </Ui>
  );
}
