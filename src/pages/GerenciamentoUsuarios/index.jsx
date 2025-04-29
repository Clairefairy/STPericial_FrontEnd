import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Gerenciamento_Laudos.module.css";
import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../util/service";
import { AuthContext } from "../../util/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";

function Gerenciamento_Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const { usuario } = useContext(AuthContext);
  const isAdmin = usuario.user.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    if (location.state?.notAdmin) {
      toast.error("Você não tem permissão nessa página.");
    }
    if (location.state?.criado) {
      toast.success("Usuário criado com sucesso!");
    }
    if (location.state?.editado) {
      toast.success("Usuário atualizado com sucesso!");
    }
    if (location.state?.deletado) {
      toast.success("Usuário removido com sucesso!");
    }
  }, [location]);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      await buscar("/users", setUsuarios, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403) {
        navigate("/login", { state: { notAdmin: true } });
      }
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setUsuarioToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUsuarioToDelete(null);
  };

  const confirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      await deletar("/users/" + usuarioToDelete, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
      setUsuarios(usuarios.filter((user) => user._id !== usuarioToDelete));
      toast.success("Usuário removido com sucesso!");
    } catch (err) {
      toast.error("Erro ao remover usuário.");
    } finally {
      setShowDeleteConfirm(false);
      setUsuarioToDelete(null);
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
          <p>Carregando usuários...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <p>Ocorreu um erro ao carregar os usuários.</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <section className={styles.gerenciamentoCasos}>
          <div className={styles.header}>
            <h1>Gerenciamento de Usuários</h1>
            <p>
              Gerencie os usuários do sistema e suas permissões.
            </p>

            {isAdmin && (
              <div className={styles.adicionarWrapper}>
                <Link to="/dashboard/usuarios/criar" className={styles.adicionarCaso}>
                  Criar Usuário
                </Link>
              </div>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Data de Criação</th>
                  <th>Última Atualização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{formatarData(user.createdAt)}</td>
                    <td>{formatarData(user.updatedAt)}</td>
                    <td className={styles.actions}>
                      {isAdmin && (
                        <>
                          <button
                            className={styles.editar}
                            onClick={() => navigate("/dashboard/usuarios/editar", { state: { usuario: user } })}
                          >
                            Editar
                          </button>

                          {usuario.user.email !== user.email &&
                            <button
                              className={styles.excluir}
                              onClick={() => handleDeleteClick(user._id)}
                            >
                              Excluir
                            </button>
                          }
                         
                        </>
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
            <p>Você tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
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

export default Gerenciamento_Usuarios;