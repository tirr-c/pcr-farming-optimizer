import styled from 'astroturf';
import React from 'react';

import BaseIngredientList from '../components/BaseIngredientList';
import Layout from '../components/Layout';
import UnitEquipList from '../components/UnitEquipList';
import UnitList from '../components/UnitList';

const Ui = styled('main')`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template:
    'a c'
    'b c' 1fr
    / 1fr 1fr;
  grid-gap: 16px;
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template:
      'a c'
      'b c' 1fr
      / 1fr 600px;
  }

  @media (max-width: 1000px) {
    grid-template: none / auto;
    grid-auto-rows: auto;
  }

  > :nth-child(1) {
    grid-area: a;
  }

  > :nth-child(2) {
    grid-area: b;
  }

  > :nth-child(3) {
    grid-area: c;
  }
`;

export default function Index() {
  return (
    <Layout>
      <Ui>
        <UnitList />
        <React.Suspense fallback={<div>Loading equipment info...</div>}>
          <UnitEquipList />
          <div>
            <BaseIngredientList />
          </div>
        </React.Suspense>
      </Ui>
    </Layout>
  );
}
