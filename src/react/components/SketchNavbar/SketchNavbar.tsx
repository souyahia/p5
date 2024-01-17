import styles from './SketchNavbar.module.css';
import { useNavigate } from 'react-router-dom';
import { SketchListIcon } from '../SketchListIcon';

export interface SketchListIconProps {
  name: string;
}

export function SketchNavbar({ name }: SketchListIconProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <img src='/arrow.png' alt='Back' />
      </button>
      <SketchListIcon name={name} />
      <div className={styles.name}>{name}</div>
    </div>
  );
}
