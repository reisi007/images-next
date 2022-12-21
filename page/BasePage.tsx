import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { CONTAIINER_CLASSES } from '../utils/Css';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';

export type BasePageProps = { children: ReactNode, className?: string } & HeaderProps;

export function BasePage({
  children,
  className,
  ...headerProps
}: BasePageProps) {
  return (
    <>
      <Header {...headerProps} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
