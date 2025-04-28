import styles from "./WelcomeMessage.module.css";

const WelcomeMessage = ({ name }) => {
  return (
    <div className={styles.welcomeBox}>
      <h2 className={styles.title}>
        Seja bem-vindo, <span className={styles.highlight}>{name}</span>.
      </h2>
      <p className={styles.subtitle}>
        Aqui está um resumo das suas atividades recentes.
      </p>
    </div>
  );
};

export default WelcomeMessage;
