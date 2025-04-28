import { useContext, useState, useEffect } from 'react';
import styles from './FormularioFormCss.module.css';
import { AuthContext } from '../../util/UserContext';
import { cadastrar, atualizar, buscar } from '../../util/service';
import toast from 'react-hot-toast';

export default function UserForm({ onClose, onSubmit, laudoParaEditar }) {
    const { usuario } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [evidencias, setEvidencias] = useState([]);
    const [loadingEvidencias, setLoadingEvidencias] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        evidence: ''
    });

    useEffect(() => {
        const carregarEvidencias = async () => {
            setLoadingEvidencias(true);
            try {
                await buscar('/evidences', setEvidencias, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
            } catch (error) {
                console.error("Erro ao carregar evidências:", error);
                toast.error("Erro ao carregar evidências");
            } finally {
                setLoadingEvidencias(false);
            }
        };

        carregarEvidencias();
    }, [usuario.token]);

    useEffect(() => {
        if (laudoParaEditar) {
            setFormData({
                title: laudoParaEditar.title || '',
                description: laudoParaEditar.description || '',
                evidence: laudoParaEditar.evidence || ''
            });
        }
    }, [laudoParaEditar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const dadosParaEnviar = {
            ...formData,
            expertResponsible: usuario.user.id
        };

        try {
            let resposta;
            if (laudoParaEditar) {
                resposta = await atualizar(`/reports/${laudoParaEditar._id}`, dadosParaEnviar, null, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Laudo editado com sucesso!");
                if (onSubmit) onSubmit();
            } else {
                resposta = await cadastrar('/reports', dadosParaEnviar, null, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Laudo criado com sucesso!");
                if (onSubmit) onSubmit();
            }
            onClose();
        } catch (e) {
            console.error("Erro ao salvar laudo:", e);
            toast.error("Ocorreu um erro ao salvar o laudo!");
            toast.error(e.response?.data?.message || "Ocorreu um erro ao salvar o laudo!");

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.popup}>
            <h2 className={styles.title}>{laudoParaEditar ? 'Editar Laudo' : 'Criar Novo Laudo'}</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Título do Laudo*
                        <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            placeholder="Digite o título do laudo"
                            className={styles.input}
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Descrição Detalhada*
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            minLength={10} 
                            placeholder="Descreva os detalhes do laudo"
                            className={styles.textarea}
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Evidência Relacionada*
                        {loadingEvidencias ? (
                            <p>Carregando evidências...</p>
                        ) : (
                            <select
                                name="evidence"
                                value={formData.evidence}
                                onChange={handleChange}
                                required
                                className={styles.select}
                            >
                                <option value="">Selecione uma evidência</option>
                                {evidencias.map((evidencia) => (
                                    <option key={evidencia._id} value={evidencia._id}>
                                        {`${evidencia.type} - ${evidencia.text || 'Sem descrição'} (${new Date(evidencia.collectionDate).toLocaleDateString()})`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <p className={styles.readOnlyField}>
                        Perito Responsável: <strong>{usuario.user.name}</strong>
                    </p>
                </div>

                <div className={styles.buttons}>
                    <button 
                        type="submit" 
                        disabled={isLoading || loadingEvidencias}
                        className={styles.submitButton}
                    >
                        {isLoading ? "Salvando..." : (laudoParaEditar ? "Atualizar Laudo" : "Criar Laudo")}
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}