import styles from './Home.module.css';
import { SketchList } from '../../components';
import { sketches } from '../../../sketches';

export function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>Samy's</div>
        <img src='/p5.png' alt='P5 Logo' />
        <div>Universe</div>
      </div>
      <SketchList sketches={sketches} />
    </div>
  );
}
