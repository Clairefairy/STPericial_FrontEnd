
import Navbar from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import styles from "./Gerenciamento_Casos.module.css";
import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../util/service";
import { AuthContext } from "../../util/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleArrowUp, CircleDashed } from "lucide-react";
import toast from "react-hot-toast";

function Gerenciamento_casos() {
  const [casos, setCasos] = useState([]);
  const [casosFiltrados, setCasosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [casoToDelete, setCasoToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    status: "todos",
    responsavel: "todos",
    ordenacao: "recentes"
  });

  const { usuario } = useContext(AuthContext);

  const isAdminOrPerito = usuario.user.role === "admin" || usuario.user.role === "perito";
  const isAdmin = usuario.user.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    carregarCasos();
  }, []);

  useEffect(() => {
    if (location.state?.notAdmin) {
      toast.error("Você não tem permissão nessa página.");
    }
    if (location.state?.criado) {
      toast.success("Caso criado!");
    }
    if (location.state?.editado) {
      toast.success("Caso editado!");
    }
    if (location.state?.deletado) {
      toast.success("Caso deletado!");
    }
  }, [location]);

  useEffect(() => {
   
    let resultado = [...casos];


    if (filtros.status !== "todos") {
      resultado = resultado.filter(caso => caso.status === filtros.status);
    }

  
    if (filtros.responsavel !== "todos") {
      resultado = resultado.filter(caso => caso.responsible === filtros.responsavel);
    }


    resultado.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return filtros.ordenacao === "recentes" ? dateB - dateA : dateA - dateB;
    });

    setCasosFiltrados(resultado);
  }, [casos, filtros]);

  const carregarCasos = async () => {
    setLoading(true);
    setError(null);
    try {
      await buscar("/cases", setCasos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
    } catch (err) {
      setError(err);
      if (err.status === 401 || err.status === 403) navigate("/login", { state: { notAdmin: true } });
      toast.error("Erro ao buscar.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCasoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCasoToDelete(null);
  };

  const confirmDelete = async () => {
    if (!casoToDelete) return;
    try {
      await deletar("/cases/" + casoToDelete, {
        headers: {
          Authorization: `Bearer ${usuario.token}`
        }
      });
      setCasos(casos.filter((caso) => caso._id !== casoToDelete));
      setShowDeleteConfirm(false);
      setCasoToDelete(null);
      toast.success("Caso deletado com sucesso!");
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


  const statusUnicos = [...new Set(casos.map(caso => caso.status))];

  const responsaveisUnicos = [...new Set(casos.map(caso => caso.responsible).filter(Boolean))];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Container>
        <div className={styles.loadingContainer}>
          <CircleDashed className={styles.loadingIcon} size={48} />
          <p>Carregando casos...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <p>Ocorreu um erro ao carregar os casos. Redirecionando para login...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <section className={styles.gerenciamentoCasos}>
          <div className={styles.header}>
            <h1>Gerenciamento de Casos</h1>
            <p>Gerencie informações importantes como documentos e relatórios de forma centralizada.</p>

            <div className={styles.filtroContainer}>
              {isAdminOrPerito && (
                <div className={styles.adicionarWrapper}>
                  <Link to="/dashboard/casos/criar" className={styles.adicionarCaso}>
                    Criar Caso
                  </Link>
                </div>
              )}

              <div className={styles.filtrosWrapper}>
                <div className={styles.filtroGroup}>
                  <label htmlFor="filtro-status">Status:</label>
                  <select
                    id="filtro-status"
                    name="status"
                    value={filtros.status}
                    onChange={handleFiltroChange}
                    className={styles.selectFiltro}
                  >
                    <option value="todos">Todos</option>
                    {statusUnicos.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filtroGroup}>
                  <label htmlFor="filtro-responsavel">Responsável:</label>
                  <select
                    id="filtro-responsavel"
                    name="responsavel"
                    value={filtros.responsavel}
                    onChange={handleFiltroChange}
                    className={styles.selectFiltro}
                  >
                    <option value="todos">Todos</option>
                    {responsaveisUnicos.map((responsavel) => (
                      <option key={responsavel} value={responsavel}>
                        {responsavel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filtroGroup}>
                  <label htmlFor="filtro-ordenacao">Ordenar por:</label>
                  <select
                    id="filtro-ordenacao"
                    name="ordenacao"
                    value={filtros.ordenacao}
                    onChange={handleFiltroChange}
                    className={styles.selectFiltro}
                  >
                    <option value="recentes">Mais recentes</option>
                    <option value="antigos">Mais antigos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nº Processo</th>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Data Abertura</th>
                  <th>Data Encerramento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {casosFiltrados.map((caso) => (
                  <tr key={caso._id}>
                    <td>{caso.numberProcess}</td>
                    <td>{caso.title}</td>
                    <td>{caso.status}</td>
                    <td>{caso.responsible || "-"}</td>
                    <td>{formatarData(caso.openingDate)}</td>
                    <td>{formatarData(caso.closingDate)}</td>
                    <td className={styles.actions}>
                      {isAdminOrPerito && (
                        <button
                          className={styles.editar}
                          onClick={() => navigate("/dashboard/casos/editar", { state: { caso: caso } })}
                        >
                          Editar
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          className={styles.excluir}
                          onClick={() => handleDeleteClick(caso._id)}
                        >
                          Excluir
                        </button>
                      )}

                      <Link to={`/dashboard/caso/${caso._id}`}>
                        <button className={styles.laudoButton}>Detalhes</button>
                      </Link>
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
            <p>Você tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita.</p>
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

export default Gerenciamento_casos;
