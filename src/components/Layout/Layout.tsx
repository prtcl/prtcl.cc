import type { PropsWithChildren } from "react";
import { Box } from "theme-ui";

export const Layout = (props: PropsWithChildren) => {
  return <Box>{props.children}</Box>;
};
