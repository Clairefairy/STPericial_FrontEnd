import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Gerenciamento_Casos.module.css"; 
import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../util/service";
import { AuthContext } from "../../util/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";

function Gerenciamento_vitimas() {
  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vitimaToDelete, setVitimaToDelete] = useState(null);

  const { usuario } = useContext(AuthContext);
  const isAdmin = usuario.user.role === "admin";
  const isAdminOrPerito = usuario.user.role === "admin" || usuario.user.role === "perito";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    carregarVitimas();
  }, []);

 

  const carregarVitimas = async () => {
    setLoading(true);
    setError(null);
    try {
      await buscar("/victims", setVitimas, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403) navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar vítimas.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setVitimaToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setVitimaToDelete(null);
  };

  const confirmDelete = async () => {
    if (!vitimaToDelete) return;
    try {
      await deletar("/victims/" + vitimaToDelete, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
      setVitimas(vitimas.filter((vitima) => vitima._id !== vitimaToDelete));
      setShowDeleteConfirm(false);
      setVitimaToDelete(null);
      toast.success("Vítima deletada com sucesso!");
    } catch (err) {
      setError(err);
      navigate("/login", { state: { notAdmin: true } });
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <Container>
        <div className={styles.loadingContainer}>
          <CircleDashed className={styles.loadingIcon} size={48} />
          <p>Carregando vítimas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <p>Ocorreu um erro ao carregar as vítimas. Redirecionando para login...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <section className={styles.gerenciamentoCasos}> 
          <div className={styles.header}>
            <h1>Gerenciamento de Vítimas</h1>
            <p>
              Visualize e gerencie as vítimas registradas no sistema.
            </p>

           
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Sexo</th>
                  <th>Data de Nascimento</th>
                  <th>Identificação</th>
                  <th>Identificada</th>
                  <th>Observações</th>
                  <th>ID</th>

                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vitimas.map((vitima) => (
                  <tr key={vitima._id}>
                    <td>{vitima.name}</td>
                    <td>{vitima.sex}</td>
                    <td>{formatarData(vitima.dateBirth)}</td>
                    <td>{vitima.identification}</td>
                    <td>{vitima.identified ? "Sim" : "Não"}</td>
                    <td className={styles.descricaoCell}>{vitima.observations || "-"}</td>
                    <td>{vitima._id}</td>

                    <td className={styles.actions}>
                    
                      {isAdmin && (
                        <button
                          className={styles.excluir}
                          onClick={() => handleDeleteClick(vitima._id)}
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>

      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmPopup}>
            <h3>Confirmar Exclusão</h3>
            <p>Você tem certeza que deseja excluir esta vítima? Esta ação não pode ser desfeita.</p>
            <div className={styles.confirmButtons}>
              <button className={`${styles.confirmButton} ${styles.cancel}`} onClick={cancelDelete}>
                Cancelar
              </button>
              <button className={`${styles.confirmButton} ${styles.delete}`} onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gerenciamento_vitimas;