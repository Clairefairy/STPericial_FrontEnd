import { useContext } from "react";
import styles from "./WelcomeMessage.module.css";
import { AuthContext } from "../../util/UserContext";

const WelcomeMessage = ({  }) => {

  const {usuario} = useContext(AuthContext)
  return (
    <div className={styles.welcomeBox}>
      <h2 className={styles.title}>
        Seja bem-vindo, <span className={styles.highlight}>{usuario.user.name}</span>.
      </h2>
      <p className={styles.subtitle}>
        Aqui está um resumo das suas atividades recentes.
      </p>
    </div>
  );
};

export default WelcomeMessage;
