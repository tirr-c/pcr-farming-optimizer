import styled from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';

import BaseIngredientList from '../components/BaseIngredientList';
import Layout from '../components/Layout';
import UnitEquipList from '../components/UnitEquipList';
import UnitList from '../components/UnitList';

const Title = styled('h1')`
  font-size: 28px;
  font-weight: bold;
`;

const Ui = styled('main')`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template:
    't t'
    'a c'
    'b c' 1fr
    / 1fr 1fr;
  grid-gap: 16px;
  gap: 16px;

  @media (max-width: 1200px + 16px * 2) {
    grid-template:
      't t'
      'a c'
      'b c' 1fr
      / 1fr 600px;
  }

  @media (max-width: 1000px) {
    grid-template: 't' 'a' 'b' 'c' / 100%;
    grid-auto-rows: auto;
  }

  > :nth-child(1) {
    grid-area: t;
  }

  > :nth-child(2) {
    grid-area: a;
  }

  > :nth-child(3) {
    grid-area: b;
  }

  > :nth-child(4) {
    grid-area: c;
  }
`;

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
}

export default function Index(props: Props) {
  return (
    <Ui>
      <Title>{props.data.site.siteMetadata.title}</Title>
      <Layout>
        <UnitList />
        <React.Suspense fallback={<div>Loading equipment info...</div>}>
          <UnitEquipList />
          <div>
            <BaseIngredientList />
          </div>
        </React.Suspense>
      </Layout>
    </Ui>
  );
}

export const query = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
