import { useNavigate } from 'react-router-dom';
import styles from './SketchList.module.css';
import { SketchListItem } from '../SketchListItem';
import { id, SketchDetails } from '../../../sketches';

export interface SketchListProps {
  sketches?: SketchDetails[];
}

export function SketchList({ sketches = [] }: SketchListProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {sketches.length === 0 ? (
        <span className={styles.emptyMessage}>
          There are no sketches available.
        </span>
      ) : sketches.map((sketch) => (
        <SketchListItem
          key={id(sketch)}
          name={sketch.name}
          onClick={() => navigate(`sketch/${id(sketch)}`)}
        />
      ))}
    </div>
  );
}
