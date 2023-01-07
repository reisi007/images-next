import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import styles from '../utils/Utils.module.css';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from '../utils/ReisishotIcons';

export type NavMenuProps = { title: string, menuItems?: { [key: string]: PathEntry } };

export function NavMenu({ title, menuItems }: NavMenuProps) {
  const curPath = useRouter().asPath.substring(1);
  const allMenuLinks = useMemo(() => (menuItems === undefined ? [] : Object.entries(menuItems)
    .filter(([p]) => p !== curPath)), [curPath, menuItems]);

  const importantLinks = useMemo(() => allMenuLinks.filter(([_, v]) => v.important === true), [allMenuLinks]);
  const restLinks = useMemo(() => allMenuLinks.filter(([_, v]) => v.important !== true), [allMenuLinks]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const onClick = useCallback(() => setMenuVisible((c) => !c), []);
  const classes = 'grid grid-cols-1 md:grid-cols-2';

  return (
    <nav className={classNames('w-full bg-primary p-4 text-onPrimary', styles.container)}>
      <div className="flex w-full">
        <div className="w-full font-logo">
          <h1 className="w-full pb-2 text-center">{title}</h1>
          <ul className={classNames('pb-1', classes, { 'mb-2': isMenuVisible })}>
            {importantLinks.map(renderMenuLink)}
          </ul>
          {restLinks.length > 0 && isMenuVisible && (
            <ul className={classNames(classes, 'mt-2 border-t-2 border-onPrimary pt-2')}>
              {restLinks.map(renderMenuLink)}
            </ul>
          )}
        </div>
        {restLinks.length > 0 && <ReisishotIcon className="mt-4" onClick={onClick} size={ReisishotIconSizes.LARGE} icon={ReisishotIcons.Menu} />}
      </div>
    </nav>
  );
}

export type PathEntry = { title: string, important?: boolean };

function renderMenuLink(props: [string, PathEntry]) {
  const [url, { title }] = props;
  return (
    <li className="inline-block list-none text-center" key={url}>
      <Link className="black text-center text-lg hover:text-xl" href={`/${url}`}>{title}</Link>
    </li>
  );
}
