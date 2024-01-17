import { useState } from 'react';
import styles from './SketchListItem.module.css';
import { SketchListIcon } from '../SketchListIcon';
import { palette } from '../../../universe';

export interface SketchListItemProps {
  name: string;
  onClick?: () => void;
}

export function SketchListItem({ name, onClick }: SketchListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.container}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        margin: isHovered ? '20px' : '21px',
        borderWidth: isHovered ? '2px' : '1px',
        borderColor: isHovered ? palette.primary : '',
      }}
    >
      <SketchListIcon name={name} />
      <span
        className={styles.name}
        style={{
          color: isHovered ? palette.primary : '',
        }}
      >
        {name}
      </span>
    </div>
  );
}
