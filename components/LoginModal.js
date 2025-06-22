import styles from '@/styles/LoginModal.module.css';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function LoginModal({message, onClose}) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <FaExclamationTriangle className={`${styles.icon} ${styles.error}`} />
                <p>{message}</p>
                <button className={styles.button} onClick={onClose}>닫기</button>
            </div>
        </div>
    )
}