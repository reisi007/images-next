import React, { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { FloatingActionButton } from '../button/FloatingActionButton';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from '../utils/ReisishotIcons';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';
import { useIntersection } from '../utils/UseIntersection';
import { useModal } from '../utils/Modal';
import { ContactForm } from '../form/ContactForm';
import styles from '../utils/Utils.module.css';
import { FONT_MARTINA } from '../fonts/Font';

export type BasePageProps = { children: ReactNode, className?: string, showContactForm?:boolean };

export function BasePage({
  children,
  className,
  showContactForm = true,
  ...headerProps
}: BasePageProps & HeaderProps) {
  const [isFabVisible, setFabVisible] = useState(true);

  const ref = useIntersection(
    useCallback((e) => setFabVisible(!e[0].isIntersecting), [setFabVisible]),
    '0px 0px 0px 0px',
  );
  const [dialog, setDialogVisible] = useModal('Kontaktiere mich', (setVisible) => (<ContactForm moreOnSubmit={() => setVisible(false)} />));
  const openDialogAction = useCallback(() => {
    setDialogVisible(true);
  }, [setDialogVisible]);

  return (
    <div className={FONT_MARTINA.variable}>
      <Header {...headerProps} />
      <main className={classNames(styles.container, className)}>
        {children}
      </main>
      <footer className="mt-4 mb-2" ref={ref}>
        { showContactForm && (
        <>
          <h2>Kontaktere mich</h2>
          <ContactForm className={classNames(styles.container, 'p pt-6')} />
        </>
        )}
        <Footer />
      </footer>
      {dialog}
      { showContactForm && isFabVisible && (
        <FloatingActionButton onClick={openDialogAction} className="group inline-flex items-center justify-center bg-primary-accent/80 text-onPrimary-accent hover:bg-primary-accent">
          <ReisishotIcon size={ReisishotIconSizes.LARGE} className="!text-onPrimary group-hover:mr-2" icon={ReisishotIcons.Mail} />
          <span className="hidden duration-500 ease-in-out group-hover:inline-block">Kontaktiere mich</span>
        </FloatingActionButton>
      )}
    </div>
  );
}
