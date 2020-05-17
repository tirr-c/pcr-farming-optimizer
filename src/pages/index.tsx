import React from 'react';

import UnitEquipList from '../components/UnitEquipList';
import UnitList from '../components/UnitList';

export default function Index() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UnitList />
      <React.Suspense fallback={<div>Loading equipment info...</div>}>
        <UnitEquipList />
      </React.Suspense>
    </React.Suspense>
  );
}

