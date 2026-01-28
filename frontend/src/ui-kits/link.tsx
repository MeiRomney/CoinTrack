/**
 * Link component integrated with React Router for client-side navigation
 */

import * as Headless from "@headlessui/react";
import React, { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";

export const Link = forwardRef(function Link(
  { href, ...props }: { href?: string } & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      {href ? (
        <RouterLink to={href} {...props} ref={ref} />
      ) : (
        <a {...props} ref={ref} />
      )}
    </Headless.DataInteractive>
  );
});
