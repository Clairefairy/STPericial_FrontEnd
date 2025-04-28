import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Gerenciamento_dental.module.css";
import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../util/service";
import { AuthContext } from "../../util/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleArrowUp, CircleDashed } from "lucide-react";
import toast from "react-hot-toast";

function Gerenciamento_dental() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState(null);

  const { usuario } = useContext(AuthContext);

  const isAdminOrPerito = usuario.user.role === "admin" || usuario.user.role === "perito";
  const isAdmin = usuario.user.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    carregarRegistros();
  }, []);

  useEffect(() => {
    if (location.state?.notAdmin) {
      toast.error("Você não tem permissão nessa página.");
    }
    if (location.state?.criado) {
      toast.success("Registro criado!");
    }
    if (location.state?.editado) {
      toast.success("Registro editado!");
    }
    if (location.state?.deletado) {
      toast.success("Registro deletado!");
    }
  }, [location]);

  const carregarRegistros = async () => {
    setLoading(true);
    setError(null);
    try {
      await buscar("/dentalRecord", setRegistros, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403) navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar registros.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setRegistroToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setRegistroToDelete(null);
  };

  const confirmDelete = async () => {
    if (!registroToDelete) return;
    try {
      await deletar("/dentalRecord/" + registroToDelete, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
      setRegistros(registros.filter((registro) => registro._id !== registroToDelete));
      setShowDeleteConfirm(false);
      setRegistroToDelete(null);
      toast.success("Registro deletado com sucesso!");
    } catch (err) {
      setError(err);
      navigate("/login", { state: { notAdmin: true } });
    }
  };

  if (loading) {
    return (
      <Container>
        <div className={styles.loadingContainer}>
          <CircleDashed className={styles.loadingIcon} size={48} />
          <p>Carregando registros dentários...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <p>Ocorreu um erro ao carregar os registros. Redirecionando para login...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <section className={styles.gerenciamentoCasos}>
          <div className={styles.header}>
            <h1>Gerenciamento de Registros Dentários</h1>
            <p>Gerencie informações importantes sobre registros dentários de forma centralizada.</p>

            {isAdminOrPerito && (
              <div className={styles.adicionarWrapper}>
                <Link to="/dashboard/registros-odontologicos/criar" className={styles.adicionarCaso}>
                  Criar Registro
                </Link>
              </div>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Vítima</th>
                  <th>Dentes Faltantes</th>
                  <th>Marcas Dentárias</th>
                  <th>Notas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro._id}>
                    <td>{registro.victim}</td>
                    <td>{registro.missingTeeth.join(", ")}</td>
                    <td>{registro.dentalMarks.join(", ")}</td>
                    <td>{registro.notes || "-"}</td>
                    <td className={styles.actions}>
                      {isAdminOrPerito && (
                        <button
                          className={styles.editar}
                          onClick={() => navigate("/dashboard/registros-odontologicos/editar", { state: { dentalRecord: registro } })}
                        >
                          Editar
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          className={styles.excluir}
                          onClick={() => handleDeleteClick(registro._id)}
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
            <p>Você tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.</p>
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

export default Gerenciamento_dental;