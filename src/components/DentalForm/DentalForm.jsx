import { useContext, useState, useEffect } from 'react';
import styles from './FormularioFormCss.module.css';
import { AuthContext } from '../../util/UserContext';
import { cadastrar, atualizar, buscar } from '../../util/service';
import toast from 'react-hot-toast';

export default function DentalForm({ onClose, onSubmit, dentalRecordParaEditar }) {
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
        missingTeeth: [],
        dentalMarks: [],
        notes: '',
        victim: ''
    });

    const [currentMissingTooth, setCurrentMissingTooth] = useState('');
    const [currentDentalMark, setCurrentDentalMark] = useState('');

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
        if (dentalRecordParaEditar) {
            setFormData({
                missingTeeth: dentalRecordParaEditar.missingTeeth || [],
                dentalMarks: dentalRecordParaEditar.dentalMarks || [],
                notes: dentalRecordParaEditar.notes || '',
                victim: dentalRecordParaEditar.victim || ''
            });
        }
    }, [dentalRecordParaEditar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleVictimChange(e) {
        const { name, value } = e.target;
        setNewVictim({ ...newVictim, [name]: value });
    }

    function handleAddMissingTooth() {
        if (currentMissingTooth.trim()) {
            setFormData(prev => ({
                ...prev,
                missingTeeth: [...prev.missingTeeth, currentMissingTooth.trim()]
            }));
            setCurrentMissingTooth('');
        }
    }

    function handleRemoveMissingTooth(index) {
        setFormData(prev => ({
            ...prev,
            missingTeeth: prev.missingTeeth.filter((_, i) => i !== index)
        }));
    }

    function handleAddDentalMark() {
        if (currentDentalMark.trim()) {
            setFormData(prev => ({
                ...prev,
                dentalMarks: [...prev.dentalMarks, currentDentalMark.trim()]
            }));
            setCurrentDentalMark('');
        }
    }

    function handleRemoveDentalMark(index) {
        setFormData(prev => ({
            ...prev,
            dentalMarks: prev.dentalMarks.filter((_, i) => i !== index)
        }));
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
            if (dentalRecordParaEditar) {
                resposta = await atualizar(`/dentalRecord/${dentalRecordParaEditar._id}`, formData, setFormData, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });

                toast.success("Registro dental atualizado!");
                if (onSubmit) onSubmit();
                onClose();
            } else {
                resposta = await cadastrar('/dentalRecord', formData, setFormData, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Registro dental criado!");
                if (onSubmit) onSubmit(resposta.dentalRecord._id);
            }
        } catch (e) {
            console.error("Erro ao salvar registro dental:", e);
            toast.error("Ocorreu um erro!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className={styles.popup}>
                <h2 className={styles.title}>{dentalRecordParaEditar ? 'Editar Registro Dental' : 'Novo Registro Dental'}</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Dentes Ausentes
                        <div className={styles.arrayInputContainer}>
                            <input
                                value={currentMissingTooth}
                                onChange={(e) => setCurrentMissingTooth(e.target.value)}
                                placeholder="Adicionar dente ausente"
                            />
                            <button
                                type="button"
                                onClick={handleAddMissingTooth}
                                className={styles.addButton}
                            >
                                Adicionar
                            </button>
                        </div>
                        <div className={styles.arrayItems}>
                            {formData.missingTeeth.map((tooth, index) => (
                                <div key={index} className={styles.arrayItem}>
                                    <span>{tooth}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMissingTooth(index)}
                                        className={styles.removeArrayButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </label>

                    <label className={styles.label}>
                        Marcas Odontologicos
                        <div className={styles.arrayInputContainer}>
                            <input
                                value={currentDentalMark}
                                onChange={(e) => setCurrentDentalMark(e.target.value)}
                                placeholder="Adicionar marca dental"
                            />
                            <button
                                type="button"
                                onClick={handleAddDentalMark}
                                className={styles.addButton}
                            >
                                Adicionar
                            </button>
                        </div>
                        <div className={styles.arrayItems}>
                            {formData.dentalMarks.map((mark, index) => (
                                <div key={index} className={styles.arrayItem}>
                                    <span>{mark}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDentalMark(index)}
                                        className={styles.removeArrayButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </label>

                    <label className={styles.label}>
                        Observações
                        <textarea name="notes" value={formData.notes} onChange={handleChange} />
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
                            {isLoading ? "Salvando..." : dentalRecordParaEditar ? "Salvar" : "Criar"}
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