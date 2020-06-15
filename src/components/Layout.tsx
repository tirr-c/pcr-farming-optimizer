import styled from 'astroturf';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { useIntl } from 'gatsby-plugin-intl';
import React from 'react';
import { Helmet } from 'react-helmet';

const Ui = styled('main')`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template:
    's s'
    't t'
    'a c'
    'b c' 1fr
    'f f'
    / 1fr 1fr;
  grid-gap: 16px;
  gap: 16px;

  @media (max-width: 1200px + 16px * 2) {
    grid-template:
      's s'
      't t'
      'a c'
      'b c' 1fr
      'f f'
      / 1fr 600px;
  }

  @media (max-width: 1000px) {
    grid-template: 's' 't' 'a' 'b' 'c' 'f' / 100%;
    grid-auto-rows: auto;
  }

  > nav {
    grid-area: s;
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

const Servers = styled('nav')`
  justify-content: end;
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
  const queryResult = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          availableRegions {
            region
            locale
          }
        }
      }
    }
  `);
  const { availableRegions } = queryResult.site.siteMetadata;

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
  const regions: { locale: string; display: string }[] = availableRegions.map(({ region, locale }: any) => {
    const regionText = intl.formatDisplayName(region.toUpperCase(), { type: 'region', style: 'short' });
    const languageText = intl.formatDisplayName(locale, { type: 'language', style: 'short' });
    const display = intl.formatMessage(
      { id: 'region-template' },
      { lang: languageText, region: regionText },
    );
    return {
      locale,
      display,
    };
  });
  return (
    <Ui>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Servers>
        {regions.map(({ locale, display }, idx) => (
          <React.Fragment key={locale}>
            {idx > 0 && ' | '}
            <Link to={`/${locale}/`}>{display}</Link>
          </React.Fragment>
        ))}
      </Servers>
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
