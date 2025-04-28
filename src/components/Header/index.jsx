import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import LogoSemFundo from "../../assets/STPericial logo redimensionada.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../util/UserContext";

const Navbar = () => {
  const { usuario } = useContext(AuthContext);
  const isLogado = usuario.user.role !== "deslogado";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <Link to="/">
        <img
          src={LogoSemFundo}
          alt="Logo STPericial"
          className={styles.logoImage}
        />
      </Link>

      <div className={styles.menuIcon} onClick={toggleMenu}>
        &#9776;
      </div>

      <nav className={`${styles.navbar} ${menuOpen ? styles.open : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
        <Link to="/servicos" onClick={() => setMenuOpen(false)}>Serviços</Link>
        <Link to="/artigos" onClick={() => setMenuOpen(false)}>Artigos</Link>
        <Link to="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>

        {isLogado ?
          <Link to="/dashboard" className={styles.buttonLoginLink} onClick={() => setMenuOpen(false)}>
            <button className={styles["button-login"]}>Dashboard</button>
          </Link> :
          <Link to="/login" className={styles.buttonLoginLink} onClick={() => setMenuOpen(false)}>
            <button className={styles["button-login"]}>Entrar</button>
          </Link>
        }
      </nav>
    </header>
  );
};

export default Navbar;
