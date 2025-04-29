import styles from "./Modal.module.css";

function Modal({ titulo, texto, imagem, onClose }) {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>{titulo}</h2>
                <img src={imagem} alt={titulo} className={styles.modalImage} />
                <p>{texto}</p>
                <div className={styles.modalButtons}>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.leiaMais}
                    >
                        Leia mais
                    </a>
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
