import React from 'react';

import UnitList from '../components/UnitList';

export default function Index() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UnitList />
    </React.Suspense>
  );
}

