import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import mainCss from '~/main.css?url';
import type { RouterContext } from '~/router';

const Root = () => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
      },
      { name: 'author', content: "Cory O'Brien" },
      {
        name: 'description',
        content: "Cory O'Brien is a software engineer and sound artist who lives in London",
      },
      { name: 'theme-color', content: '#f7f7f7' },
      { title: 'prtcl.cc' },
    ],
    links: [
      { rel: 'canonical', href: 'http://prtcl.cc' },
      { rel: 'stylesheet', href: mainCss },
    ],
  }),
  component: Root,
});
