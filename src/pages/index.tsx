import { useIntl } from 'gatsby-plugin-intl';
import React from 'react';

import BaseIngredientList from '../components/BaseIngredientList';
import Layout from '../components/Layout';
import QuestList from '../components/QuestList';
import UnitEquipList from '../components/UnitEquipList';
import UnitList from '../components/UnitList';
import Wrapper from '../components/Wrapper';

export default function Index() {
  const intl = useIntl();
  let region = 'jp';
  switch (intl.locale) {
    case 'ko': region = 'kr'; break;
  }
  return (
    <Wrapper region={region}>
      <Layout>
        <UnitList />
        <React.Suspense fallback={<div>{intl.formatMessage({ id: 'loading.equipments' })}</div>}>
          <UnitEquipList />
          <div>
            <BaseIngredientList />
            <React.Suspense fallback={<div>{intl.formatMessage({ id: 'loading.quest-info' })}</div>}>
              <QuestList />
            </React.Suspense>
          </div>
        </React.Suspense>
      </Layout>
    </Wrapper>
  );
}
