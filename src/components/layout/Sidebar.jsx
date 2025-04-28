import { Home, Folder, User, Settings, LogOut, Menu, FileText, BookUser, PersonStanding } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../util/UserContext";
import styles from "./sidebar.module.css";
import { FaTooth } from "react-icons/fa";

const Sidebar = () => {
  const { usuario, handleLogout } = useContext(AuthContext);
  const isAdmin = usuario.user.role === "admin";
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <button className={styles.menuToggle} onClick={toggleSidebar}>
        <Menu size={24} color="white" />
      </button>

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.hideMobile : styles.showMobile}`}
      >
        <div className={styles.itemsContainer}>
          <Link to="/dashboard" onClick={handleItemClick}>
            <SidebarItem icon={<Home />} label="Início" />
          </Link>

            <Link to="/dashboard/casos" onClick={handleItemClick}>
              <SidebarItem icon={<Folder />} label="Casos" />
            </Link>


          <Link to="/dashboard/laudos" onClick={handleItemClick}>
            <SidebarItem icon={<FileText />} label="Laudos" />
          </Link>


          <Link to="/dashboard/registros-odontologicos" onClick={handleItemClick}>
            <SidebarItem icon={<FaTooth />} label="Registros Odontológicos" />
          </Link>
      
          {isAdmin && <>

            <Link to="/dashboard/victims" onClick={handleItemClick}>
              <SidebarItem icon={<PersonStanding />} label="Vítimas" />
            </Link>
            <Link to="/dashboard/usuarios" onClick={handleItemClick}>
              <SidebarItem icon={<BookUser />} label="Gerenciar Usuários" />
            </Link>

          </>}
          
          <Link to="/dashboard/perfil" onClick={handleItemClick}>
            <SidebarItem icon={<User />} label="Perfil" />
          </Link>

       
          <Link to="/login" onClick={() => { handleLogout(); handleItemClick(); }}>
            <SidebarItem icon={<LogOut />} label="Sair" />
          </Link>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ icon, label }) => (
  <div className={styles.item}>
    <div className={styles.icon}>{icon}</div>
    <span className={styles.label}>{label}</span>
  </div>
);

export default Sidebar;
