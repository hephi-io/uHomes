declare module '*.svg?react' {
  // Use this if you import with ?react query (Vite specific)
  import * as React from 'react';
  export default React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

declare module '*.svg' {
  import * as React from 'react';
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}
