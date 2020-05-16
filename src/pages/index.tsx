import React from 'react';
import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

const units = new RemoteResource(async () => {
  const resp = await fetch(withPrefix('/data/unit.json'));
  return resp.json();
});

export default function Index() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UnitList />
    </React.Suspense>
  );
}

function UnitList() {
  const unitData = units.get().$data;
  return <div>{unitData.length} units</div>;
}
