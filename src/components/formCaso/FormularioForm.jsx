import { useContext, useState, useEffect } from 'react';
import styles from './FormularioFormCss.module.css';
import { AuthContext } from '../../util/UserContext';
import { cadastrar, atualizar, buscar } from '../../util/service';
import toast from 'react-hot-toast';

export default function FormularioForm({ onClose, onSubmit, casoParaEditar }) {
    const { usuario } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [victims, setVictims] = useState([]);
    const [loadingVictims, setLoadingVictims] = useState(false);
    const [showVictimPopup, setShowVictimPopup] = useState(false);
    const [newVictim, setNewVictim] = useState({
        name: '',
        sex: 'masculino',
        dateBirth: '',
        identification: '',
        identified: true,
        observations: ''
    });

    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        status: 'em_andamento',
        numberProcess: '',
        openingDate: '',
        closingDate: '',
        responsible: usuario.user.id,
        victim: ''
    });

    useEffect(() => {
        const carregarVictims = async () => {
            setLoadingVictims(true);
            try {
                await buscar('/victims', setVictims, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
            } catch (error) {
                console.error("Erro ao carregar vítimas:", error);
                toast.error("Erro ao carregar vítimas");
            } finally {
                setLoadingVictims(false);
            }
        };

        carregarVictims();
    }, [usuario.token]);

    useEffect(() => {
        if (casoParaEditar) {
            setFormData({
                type: casoParaEditar.type || '',
                title: casoParaEditar.title || '',
                description: casoParaEditar.description || '',
                status: casoParaEditar.status || 'em_andamento',
                numberProcess: casoParaEditar.numberProcess || '',
                openingDate: casoParaEditar.openingDate ? new Date(casoParaEditar.openingDate).toISOString().split('T')[0] : '',
                closingDate: casoParaEditar.closingDate ? new Date(casoParaEditar.closingDate).toISOString().split('T')[0] : '',
                responsible: casoParaEditar.responsible || usuario.user.id,
                victim: casoParaEditar.victim || ''
            });
        }
    }, [casoParaEditar, usuario.user.id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleVictimChange(e) {
        const { name, value } = e.target;
        setNewVictim({ ...newVictim, [name]: value });
    }

    async function handleCreateVictim(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const resposta = await cadastrar('/victims', newVictim, null, {
                headers: {
                    Authorization: "Bearer " + usuario.token,
                },
            });

            toast.success("Vítima criada com sucesso!");
            setVictims(prevVictims => [...prevVictims, resposta.victim]);
            setFormData(prevFormData => ({
                ...prevFormData,
                victim: resposta.victim._id
            }));
            setShowVictimPopup(false);
            setNewVictim({
                name: '',
                sex: 'masculino',
                dateBirth: '',
                identification: '',
                identified: true,
                observations: ''
            });
        } catch (error) {
            console.error("Erro ao criar vítima:", error);
            toast.error("Erro ao criar vítima");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            let resposta;
            if (casoParaEditar) {
                resposta = await atualizar(`/cases/${casoParaEditar._id}`, formData, setFormData, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });

                toast.success("Caso editado!");
                if (onSubmit) onSubmit();
                onClose();
            } else {
                resposta = await cadastrar('/cases', formData, setFormData, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Caso criado!");
                if (onSubmit) onSubmit(resposta.createAcase._id);
            }
        } catch (e) {
            console.error("Erro ao salvar caso:", e);
            toast.error("Ocorreu um erro!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className={styles.popup}>
                <h2 className={styles.title}>{casoParaEditar ? 'Editar Caso' : 'Novo Caso'}</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Tipo
                        <input name="type" value={formData.type} onChange={handleChange} />
                    </label>

                    <label className={styles.label}>
                        Título
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </label>

                    <label className={styles.label}>
                        Descrição
                        <textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} />
                    </label>

                    <label className={styles.label}>
                        Status
                        <select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="em_andamento">Em andamento</option>
                            <option value="arquivado">Arquivado</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                    </label>

                    <label className={styles.label}>
                        Nº do Processo
                        <input name="numberProcess" value={formData.numberProcess} onChange={handleChange} />
                    </label>

                    <label className={styles.label}>
                        Data de Abertura
                        <input type="date" name="openingDate" value={formData.openingDate} onChange={handleChange} />
                    </label>

                    <label className={styles.label}>
                        Data de Fechamento
                        <input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} />
                    </label>

                    <label className={styles.label}>
                        Vítima
                        
                        <div className={styles.victimContainer}>
                            <select
                                name="victim"
                                value={formData.victim}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            >
                                <option value="">Selecione uma vítima</option>
                                {victims.map((victim) => (
                                    <option key={victim._id} value={victim._id}>
                                        {victim.name} - {victim.identification || 'Sem identificação'}
                                    </option>
                                ))}
                            </select>
                            Ou
                            <button
                                type="button"
                                onClick={() => setShowVictimPopup(true)}
                                className={styles.addButton}
                            >
                                Criar Vítima?
                            </button>
                            
                           
                           
                        </div>
                    </label>

                    <div className={styles.buttons}>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Salvando..." : casoParaEditar ? "Salvar" : "Criar"}
                        </button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>

            {showVictimPopup && (
                <div className={styles.victimPopupOverlay}>
                    <div className={styles.victimPopup}>
                        <h2 className={styles.title}>Nova Vítima</h2>
                        <form onSubmit={handleCreateVictim} className={styles.form}>
                            <label className={styles.label}>
                                Nome
                                <input
                                    name="name"
                                    value={newVictim.name}
                                    onChange={handleVictimChange}
                                    required
                                />
                            </label>

                            <label className={styles.label}>
                                Sexo
                                <select
                                    name="sex"
                                    value={newVictim.sex}
                                    onChange={handleVictimChange}
                                    required
                                >
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </label>

                            <label className={styles.label}>
                                Data de Nascimento
                                <input
                                    type="date"
                                    name="dateBirth"
                                    value={newVictim.dateBirth}
                                    onChange={handleVictimChange}
                                />
                            </label>

                            <label className={styles.label}>
                                Identificação
                                <input
                                    name="identification"
                                    value={newVictim.identification}
                                    onChange={handleVictimChange}
                                    pattern="^[a-zA-Z0-9]+$"
                                    title="Apenas letras e números são permitidos"
                                />
                            </label>

                            <label className={styles.label}>
                                Identificado
                                <select
                                    name="identified"
                                    value={newVictim.identified}
                                    onChange={handleVictimChange}
                                >
                                    <option value={true}>Sim</option>
                                    <option value={false}>Não</option>
                                </select>
                            </label>

                            <label className={styles.label}>
                                Observações
                                <textarea
                                    name="observations"
                                    value={newVictim.observations}
                                    onChange={handleVictimChange}
                                />
                            </label>

                            <div className={styles.buttons}>
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Criar"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVictimPopup(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}