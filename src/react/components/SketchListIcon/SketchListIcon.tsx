import styles from './SketchListIcon.module.css';
import { colorFromHash, hash, isLightColor, palette, toHex } from '../../../universe';

export interface SketchListIconProps {
  name: string;
}

export function SketchListIcon({ name }: SketchListIconProps) {
  const backgroundColor = colorFromHash(hash(name));
  const color = isLightColor(backgroundColor) ? palette.background : palette.white;
  return (
    <div
      className={styles.container}
      style={{
        color,
        backgroundColor: toHex(backgroundColor),
      }}
    >
      <span className={styles.initial}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}
