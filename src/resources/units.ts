import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export default new RemoteResource(async () => {
  const resp = await fetch(withPrefix('/data/unit.json'));
  return resp.json();
});
