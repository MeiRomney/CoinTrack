"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { LayoutGroup } from "framer-motion";
import React, { forwardRef, useId } from "react";
import { Link } from "./link";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";

export function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      {...props}
      className={clsx(
        className,
        "relative bg-white dark:bg-neutral-900/50 shadow-md",
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10",
      )}
    />
  );
}

export function NavbarContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(className, "mx-auto max-w-7xl px-2 sm:px-4 lg:px-8")}
    />
  );
}

export function NavbarInner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={clsx(className, "flex h-16 justify-between")} />
  );
}

export function NavbarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const id = useId();

  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, "flex items-center")} />
    </LayoutGroup>
  );
}

export function NavbarLogo({
  src,
  alt = "Logo",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={clsx(className, "flex shrink-0 items-center")}>
      <img src={src} alt={alt} className="h-8 w-auto" />
    </div>
  );
}

export function NavbarLinks({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(className, "hidden lg:ml-6 lg:flex lg:space-x-8")}
    />
  );
}

export const NavbarItem = forwardRef(function NavbarItem(
  {
    active,
    className,
    children,
    ...props
  }: {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
  } & (
    | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
    | ({ href: string } & Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        "className"
      >)
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) {
  const classes = clsx(
    // Base
    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
    // Active state
    active
      ? "border-orange-500 text-neutral-800 dark:text-white"
      : "border-transparent text-neutral-600 dark:text-neutral-300 hover:border-orange-500 hover:text-neutral-800 dark:hover:text-white",
  );

  return typeof props.href === "string" ? (
    <Link
      {...props}
      className={clsx(classes, className)}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      {children}
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, className)} ref={ref}>
      {children}
    </Headless.Button>
  );
});

export function NavbarSearch({
  placeholder = "Search",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input"> & { placeholder?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
      <div
        className={clsx(
          className,
          "grid w-full max-w-lg grid-cols-1 lg:max-w-xs",
        )}
      >
        <input
          type="search"
          placeholder={placeholder}
          {...props}
          className="col-start-1 row-start-1 block w-full rounded-md bg-neutral-400/20 dark:bg-black py-1.5 pr-3 pl-10 text-base  text-neutral-800 dark:text-white outline-1 -outline-offset-1 outline-neutral-800/10 dark:outline-neutral-700/80 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 sm:text-sm/6"
        />
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-neutral-400"
        >
          <path
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

export function NavbarMobileMenuButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center lg:hidden">
      <button
        type="button"
        onClick={onClick}
        className="relative inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
      >
        <span className="absolute -inset-0.5"></span>
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="size-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export function NavbarActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(className, "hidden lg:ml-4 lg:flex lg:items-center")}
    />
  );
}

export function NavbarNotificationButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        className,
        "relative shrink-0 rounded-full p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-orange-500",
      )}
    >
      <span className="absolute -inset-1.5"></span>
      <span className="sr-only">View notifications</span>
      <BellIcon className="size-6" />
    </button>
  );
}

export function NavbarAvatar({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        className,
        "size-8 rounded-full bg-neutral-800 outline -outline-offset-1 outline-white/10",
      )}
    />
  );
}

export function NavbarMobileMenu({
  isOpen,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { isOpen: boolean }) {
  if (!isOpen) return null;

  return <div {...props} className={clsx(className, "block lg:hidden")} />;
}

export function NavbarMobileLinks({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={clsx(className, "space-y-1 pt-2 pb-3")} />;
}

export const NavbarMobileItem = forwardRef(function NavbarMobileItem(
  {
    active,
    className,
    children,
    ...props
  }: {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
  } & (
    | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
    | ({ href: string } & Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        "className"
      >)
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
) {
  const classes = clsx(
    // Base
    "block border-l-4 py-2 pr-4 pl-3 text-base font-medium",
    // Active state
    active
      ? "border-orange-500 bg-orange-600/10 text-orange-400"
      : "border-transparent text-neutral-600 dark:text-neutral-300 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white",
  );

  return typeof props.href === "string" ? (
    <Link
      {...props}
      className={clsx(classes, className)}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      {children}
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, className)} ref={ref}>
      {children}
    </Headless.Button>
  );
});

export function NavbarMobileProfile({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "border-t border-black/10 dark:border-white/10 pt-4 pb-3",
      )}
    />
  );
}

export function NavbarMobileProfileInfo({
  name,
  email,
  avatarSrc,
  onNotificationClick,
}: {
  name: string;
  email: string;
  avatarSrc: string;
  onNotificationClick?: () => void;
}) {
  return (
    <div className="flex items-center px-4">
      <div className="shrink-0">
        <img
          src={avatarSrc}
          alt=""
          className="size-10 rounded-full bg-neutral-800 outline -outline-offset-1 outline-white/10"
        />
      </div>
      <div className="ml-3">
        <div className="text-base font-medium text-neutral-800 dark:text-neutral-200">
          {name}
        </div>
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {email}
        </div>
      </div>
      <button
        type="button"
        onClick={onNotificationClick}
        className="relative ml-auto shrink-0 rounded-full p-1 text-neutral-600 dark:text-neutral-300 hover:text-white focus:outline-2 focus:outline-offset-2"
      >
        <span className="absolute -inset-1.5"></span>
        <span className="sr-only">View notifications</span>
        <BellIcon className="size-6" />
      </button>
    </div>
  );
}

export function NavbarMobileProfileLinks({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={clsx(className, "mt-3 space-y-1")} />;
}

export const NavbarMobileProfileLink = forwardRef(
  function NavbarMobileProfileLink(
    {
      className,
      children,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
    } & (
      | ({ href?: never } & Omit<Headless.ButtonProps, "as" | "className">)
      | ({ href: string } & Omit<
          React.ComponentPropsWithoutRef<typeof Link>,
          "className"
        >)
    ),
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    const classes =
      "block px-4 py-2 text-base font-medium text-neutral-400 hover:bg-white/5 hover:text-white";

    return typeof props.href === "string" ? (
      <Link
        {...props}
        className={clsx(classes, className)}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        {children}
      </Link>
    ) : (
      <Headless.Button
        {...props}
        className={clsx(classes, className)}
        ref={ref}
      >
        {children}
      </Headless.Button>
    );
  },
);
