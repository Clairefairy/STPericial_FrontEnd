import { useContext } from "react";
import { AuthContext } from "../../util/UserContext";
import styles from "./Perfil.module.css";
import Container from "../../components/Container";

function Perfil() {
    const { usuario } = useContext(AuthContext);

    if (!usuario || !usuario.user) {
        return (
            <Container>
                <div className={styles.perfilContainer}>
                    <p>Nenhum usuário logado. Faça login para ver seu perfil.</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className={styles.perfilContainer}>
                <h1>Meu Perfil</h1>

                <div className={styles.infoSection}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>ID:</span>
                            <span className={styles.infoValue}>{usuario.user.id}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Nome:</span>
                            <span className={styles.infoValue}>{usuario.user.name}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Email:</span>
                            <span className={styles.infoValue}>{usuario.user.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Tipo de usuário:</span>
                            <span className={styles.infoValue}>
                                {usuario.user.role === 'admin' ? 'Administrador' :
                                    usuario.user.role === 'perito' ? 'Perito' :
                                        'Usuário'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Perfil;