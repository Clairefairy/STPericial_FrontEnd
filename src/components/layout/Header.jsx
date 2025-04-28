import { Bell } from "lucide-react";
import styles from "./header.module.css";
import LogoSemFundo from "../../assets/STPericial_logo-sem_fundo.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../util/UserContext";
const Header = () => {

  const {usuario} = useContext(AuthContext)
  return (
    <header className={styles.header}>
      <Link to="/">
        <img
          src={LogoSemFundo}
          alt="Logo STPericial"
          className={styles.logoImage}
        />
      </Link>
      <p>Visão de {usuario.user.role}</p>

      <div className={styles.iconsContainer}>
        <button className={styles.iconButton}>
         <Bell/>
         </button>
      </div>
    </header>
  );
};

export default Header;
