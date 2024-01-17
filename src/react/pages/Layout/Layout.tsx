import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import { palette } from '../../../universe';

export function Layout() {
  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: palette.background,
        color: palette.white,
      }}
    >
      <Outlet />
    </div>
  );
}
