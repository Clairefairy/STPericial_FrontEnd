import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Gerenciamento_Laudos.module.css";
import { useContext, useEffect, useState } from "react";
import { buscar, deletar, downloadArquivo } from "../../util/service";
import { AuthContext } from "../../util/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleDashed } from "lucide-react";
import toast from "react-hot-toast";
import LaudoForm from "../../components/formLaudo/FormularioForm";

function Gerenciamento_Laudos() {
  const [laudos, setLaudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [laudoToDelete, setLaudoToDelete] = useState(null);

  const { usuario } = useContext(AuthContext);

  const isAdminOrPerito = usuario.user.role === "admin" || usuario.user.role === "perito";
  const isAdmin = usuario.user.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    carregarLaudos()
  }, []);

  useEffect(() => {
    if (location.state?.notAdmin) {
      toast.error("Você não tem permissão nessa página.");
    }

    if (location.state?.criado) {
      toast.success("Laudo criado!");
    }

    if (location.state?.editado) {
      toast.success("Laudo editado!");
    }

    if (location.state?.deletado) {
      toast.success("Laudo deletado!");
    }
  }, [location]);

  const carregarLaudos = async () => {
    setLoading(true);
    setError(null);
    try {
      await buscar("/reports", setLaudos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403 || err.status === 500) navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar.")
      navigate("/dashboard")
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setLaudoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setLaudoToDelete(null);
  };


  async function downloadLaudo(laudo) {
     
    await downloadArquivo(`/reports/${laudo._id}/pdf`, `${laudo.title}.pdf`, {
      headers: {
        Authorization: `Bearer ${usuario.token}`
      }
    });
  }

  const confirmDelete = async () => {
    if (!laudoToDelete) return;


    try {
      await deletar("/reports/" + laudoToDelete, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
      setLaudos(laudos.filter((laudo) => laudo._id !== laudoToDelete));
      setShowDeleteConfirm(false);
      setLaudoToDelete(null);
      toast.success("Laudo deletado com sucesso!");
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403 || err.status=== 500) navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar.")
      navigate("/dashboard")
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
          <p>Carregando laudos...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <p>Ocorreu um erro ao carregar os laudos. Redirecionando para login...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>

        <section className={styles.gerenciamentoCasos}>
          <div className={styles.header}>
            <h1>Gerenciamento de Laudos</h1>
            <p>
              Gerencie informações importantes como documentos e relatórios de forma centralizada.
            </p>

            {isAdminOrPerito && (
              <div className={styles.adicionarWrapper}>
                <Link to="/dashboard/laudos/criar" className={styles.adicionarCaso}>
                  Criar Laudo
                </Link>
              </div>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Data de Emissão</th>
                  <th>Perito Responsável</th>
                  <th>Evidência</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {laudos.map((laudo) => (
                  <tr key={laudo._id}>
                    <td>{laudo.title}</td>
                    <td className={styles.descricaoCell}>{laudo.description}</td>
                    <td>{formatarData(laudo.dateEmission)}</td>
                    <td>{laudo.expertResponsible}</td>
                    <td>{laudo.evidence}</td>
                    <td className={styles.actions}>
                      {isAdminOrPerito && (
                        <button
                          className={styles.editar}
                          onClick={() => navigate("/dashboard/laudos/editar", { state: { laudo: laudo } })}
                        >
                          Editar
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          className={styles.excluir}
                          onClick={() => handleDeleteClick(laudo._id)}
                        >
                          Excluir
                        </button>
                      )}

                        <button className={styles.laudoButton} onClick={() => {downloadLaudo(laudo)}}>Baixar Laudo</button>
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
            <p>Você tem certeza que deseja excluir este laudo? Esta ação não pode ser desfeita.</p>
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

export default Gerenciamento_Laudos;