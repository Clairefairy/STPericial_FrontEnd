import styles from "./Footer.module.css";
import LogoSemFundo from "../../assets/STPericial_logo-sem_fundo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <h3>Inicio</h3>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Serviços</a>
          </li>
          <li>
            <a href="#">Artigos</a>
          </li>
        </ul>
      </div>
      <div className={styles.column}>
        <h3>Sobre nós</h3>
        <ul>
          <li>
            <a href="#">Informações da Empresa</a>
          </li>
          <li>
            <a href="#">Contato</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
        </ul>
      </div>
      <div className={styles.column}>
        <h3>Suporte</h3>
        <ul>
          <li>
            <a href="#">FAQ</a>
          </li>
          <li>
            <a href="#">Telefones</a>
          </li>
          <li>
            <a href="#">Chat</a>
          </li>
        </ul>
      </div>
      <div className={styles.column}>
        <h3>Informações</h3>
        <p>
          Se você busca soluções eficientes e inovadoras para a gestão de laudos
          periciais e identificação odonto-legal, o STPericial é a escolha
          ideal.
        </p>
      </div>

      <div className={styles.social}>
        <img src={LogoSemFundo} alt="Logo STPericial" className={styles.logo} />
        <div className={styles.socialMedia}>
          <a
            href="https://twitter.com/seu_usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-x-twitter"></i>
          </a>
          <a
            href="https://facebook.com/seu_usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com/seu_usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://linkedin.com/in/seu_usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="https://youtube.com/seu_usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
