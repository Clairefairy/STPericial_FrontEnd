import { useContext, useState, useEffect } from 'react';
import styles from './FormularioEvidenciaCss.module.css';
import { AuthContext } from '../../util/UserContext';
import { cadastrarMultipart, atualizar } from '../../util/service';
import toast from 'react-hot-toast';

export default function FormularioEvidencia({ onSubmit, caso, evidenciaParaEditar, onClose }) {
    const { usuario } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const evidenciaVazia = () => ({
        _id: '',
        type: '',
        text: '',
        collectionDate: '',
        collectedBy: usuario.user.id,
        file: null,
        fileUrl: '',
        case: caso._id,
    });

    const [evidencias, setEvidencias] = useState([evidenciaVazia()]);

    useEffect(() => {
        if (evidenciaParaEditar) {
            setEvidencias([{
                _id: evidenciaParaEditar._id || '',
                type: evidenciaParaEditar.type || '',
                text: evidenciaParaEditar.text || '',
                collectionDate: evidenciaParaEditar.collectionDate?.split('T')[0] || '',
                collectedBy: evidenciaParaEditar.collectedBy || '',
                file: null,  
                fileUrl: evidenciaParaEditar.fileUrl || '',
                case: evidenciaParaEditar.case || caso._id,
            }]);
        }
    }, [evidenciaParaEditar, caso._id]);

    function handleChange(index, e) {
        const { name, value, files } = e.target;
        const novas = [...evidencias];
        novas[index] = {
            ...novas[index],
            [name]: files ? files[0] : value,
        };
        setEvidencias(novas);
    }

    function adicionarEvidencia() {
        setEvidencias([...evidencias, evidenciaVazia()]);
    }

    function removerEvidencia(index) {
        if (evidencias.length === 1) return;
        setEvidencias(evidencias.filter((_, i) => i !== index));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (evidenciaParaEditar) {
                const dados = evidencias[0];
                const dadosParaAtualizar = {
                    type: dados.type,
                    text: dados.text,
                    collectionDate: dados.collectionDate,
                    collectedBy: dados.collectedBy,
                    case: dados.case,
                };

                await atualizar(`/evidences/${evidenciaParaEditar._id}`, dadosParaAtualizar, null, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });

                toast.success('Evidência editada!');
            } else {
                for (const evidencia of evidencias) {
                    const formData = new FormData();
                    for (const key in evidencia) {
                        if (evidencia[key]) {
                            formData.append(key, evidencia[key]);
                        }
                    }
                    await cadastrarMultipart('/evidences', formData, `Bearer ${usuario.token}`);
                }

                toast.success('Evidências criadas!');
            }

            if (onSubmit) onSubmit();

        } catch (err) {
            console.error('Erro ao salvar:', err);
            toast.error('Erro ao salvar evidência(s).');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.popup}>
            <h2 className={styles.title}>
                {evidenciaParaEditar ? 'Editar Evidência' : 'Nova(s) Evidência(s)'}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                {evidencias.map((evidencia, index) => (
                    <div key={index} className={styles.evidenciaBox}>
                        {!evidenciaParaEditar && (
                            <h3 className={styles.subTitle}>Evidência {index + 1}</h3>
                        )}

                        <label className={styles.label}>
                            Tipo
                            <select
                                name="type"
                                value={evidencia.type}
                                onChange={(e) => handleChange(index, e)}
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="imagem">Imagem</option>
                                <option value="video">Vídeo</option>
                                <option value="documento">Documento</option>
                                <option value="text">Texto</option>
                            </select>
                        </label>


                        <label className={styles.label}>
                            Texto
                            <textarea
                                name="text"
                                value={evidencia.text}
                                onChange={(e) => handleChange(index, e)}
                                required
                                minLength={10}
                            />
                        </label>

                        <label className={styles.label}>
                            Data de Coleta
                            <input
                                type="date"
                                name="collectionDate"
                                value={evidencia.collectionDate}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </label>

                        {!evidenciaParaEditar && (
                            <label className={styles.label}>
                                Arquivo
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) => handleChange(index, e)}
                                    accept="image/*,application/pdf,video/*"
                                />
                            </label>
                        )}

                        {!evidenciaParaEditar && evidencias.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removerEvidencia(index)}
                                className={styles.removeBtn}
                            >
                                Remover
                            </button>
                        )}

                        {!evidenciaParaEditar && <hr className={styles.separator} />}
                    </div>
                ))}

                {!evidenciaParaEditar && (
                    <button type="button" onClick={adicionarEvidencia} className={styles.addBtn}>
                        Adicionar Evidência
                    </button>
                )}

                <div className={styles.buttons}>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : evidenciaParaEditar ? 'Salvar' : 'Salvar Tudo'}
                    </button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
