import classNames from 'classnames';
import { HTMLProps } from 'react';
import styles from './utils/Utils.module.css';

export function EmpP({ className, ...props }: HTMLProps<HTMLParagraphElement>) {
  return <div {...props} className={classNames(styles.firstLetter, className)} />;
}
