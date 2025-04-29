import { useContext, useState } from 'react';
import styles from './FormularioFormCss.module.css';
import { AuthContext } from '../../util/UserContext';
import { cadastrar, atualizar } from '../../util/service';
import toast from 'react-hot-toast';

export default function UserForm({ onClose, onSubmit, usuarioParaEditar }) {
    const { usuario } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'assistente',
        password: ''
    });

    // Preenche os dados se for edição
    useState(() => {
        if (usuarioParaEditar) {
            setFormData({
                name: usuarioParaEditar.name || '',
                email: usuarioParaEditar.email || '',
                role: usuarioParaEditar.role || 'assistente',
                password: '' // Não preenchemos a senha por segurança
            });
        }
    }, [usuarioParaEditar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        // Verifica se é uma edição e se a senha foi alterada
        const dadosParaEnviar = usuarioParaEditar
            ? {
                ...formData,
                ...(formData.password ? {} : { password: undefined }) // Remove a senha se não foi alterada
            }
            : formData;

        try {
            if (usuarioParaEditar) {
                await atualizar(`/users/${usuarioParaEditar._id}`, dadosParaEnviar, null, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Usuário atualizado com sucesso!");
            } else {
                await cadastrar('/users', dadosParaEnviar, null, {
                    headers: {
                        Authorization: "Bearer " + usuario.token,
                    },
                });
                toast.success("Usuário criado com sucesso!");
            }

            if (onSubmit) onSubmit();
            onClose();
        } catch (e) {
            console.error("Erro ao salvar usuário:", e);
            toast.error(e.response?.data?.message || "Ocorreu um erro ao salvar o usuário!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.popup}>
            <h2 className={styles.title}>{usuarioParaEditar ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Nome Completo*
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Digite o nome do usuário"
                            className={styles.input}
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        E-mail*
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Digite o e-mail do usuário"
                            className={styles.input}
                        />
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Cargo*
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={styles.select}
                        >
                            <option value="assistente">Assistente</option>
                            <option value="perito">Perito</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </label>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        {usuarioParaEditar ? 'Nova Senha' : 'Senha*'}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!usuarioParaEditar}
                            placeholder={usuarioParaEditar ? "Deixe em branco para manter a atual" : "Digite a senha"}
                            className={styles.input}
                            minLength={6}
                        />
                        {usuarioParaEditar && (
                            <small className={styles.hint}>Deixe em branco para manter a senha atual</small>
                        )}
                    </label>
                </div>

                <div className={styles.buttons}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? "Salvando..." : (usuarioParaEditar ? "Atualizar Usuário" : "Criar Usuário")}
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