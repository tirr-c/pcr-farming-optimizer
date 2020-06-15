import { useIntl } from 'gatsby-plugin-intl';
import React from 'react';

import BaseIngredientList from '../components/BaseIngredientList';
import Layout from '../components/Layout';
import QuestList from '../components/QuestList';
import UnitEquipList from '../components/UnitEquipList';
import UnitList from '../components/UnitList';
import { useResource } from '../components/Wrapper';

export default function Index() {
  const intl = useIntl();
  const load = useResource('load');
  let region = 'jp';
  switch (intl.locale) {
    case 'ko': region = 'kr'; break;
  }
  React.useEffect(() => {
    load(region);
  }, [region]);
  return (
    <Layout>
      <UnitList />
      <React.Suspense fallback={<section>{intl.formatMessage({ id: 'loading.equipments' })}</section>}>
        <UnitEquipList />
        <section>
          <BaseIngredientList />
          <React.Suspense fallback={<section>{intl.formatMessage({ id: 'loading.quest-info' })}</section>}>
            <QuestList />
          </React.Suspense>
        </section>
      </React.Suspense>
    </Layout>
  );
}
