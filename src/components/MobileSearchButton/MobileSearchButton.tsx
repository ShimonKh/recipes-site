import styles from './MobileSearchButton.module.css';

interface MobileSearchButtonProps {
  onClick: () => void;
}

export default function MobileSearchButton({ onClick }: MobileSearchButtonProps): JSX.Element {
  return (
    <button
      className={styles.mobileSearchButton}
      onClick={onClick}
      aria-label="Открыть поиск"
      type="button"
    >
      🔍
    </button>
  );
}
