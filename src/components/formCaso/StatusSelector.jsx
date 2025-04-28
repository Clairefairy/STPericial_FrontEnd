import { useState, useContext } from 'react';
import { atualizar } from '../../util/service';
import { AuthContext } from '../../util/UserContext';
import toast from 'react-hot-toast';
import styles from './status.module.css'; 

export default function StatusSelector({ caso, setCaso }) {
    const { usuario } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [auxiliar, setAuxiliar] = useState({});

    async function handleStatusChange(e) {
        const novoStatus = e.target.value;
        const casoAtualizado = { ...caso, status: novoStatus };
        setCaso(casoAtualizado);
        setIsLoading(true);

        try {
            await atualizar(`/cases/${caso._id}`, casoAtualizado, setAuxiliar, {
                headers: {
                    Authorization: 'Bearer ' + usuario.token,
                },
            });
            toast.success('Status atualizado!');
        } catch (error) {
            toast.error('Erro ao atualizar status');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    let selectClass = '';
    switch (caso.status) {
        case 'em_andamento':
            selectClass = styles.selectEmAndamento;
            break;
        case 'finalizado':
            selectClass = styles.selectFinalizado;
            break;
        case 'arquivado':
            selectClass = styles.selectArquivado;
            break;
        default:
            selectClass = '';
    }

    return (
            <select
                value={caso.status}
                onChange={handleStatusChange}
                disabled={isLoading}
                className={`${styles.select} ${selectClass}`} 
            >
                <option
                    value="em_andamento"
                    className={styles.option} 
                >
                    Em andamento
                </option>
                <option
                    value="finalizado"
                    className={styles.option} 
                >
                    Finalizado
                </option>
                <option
                    value="arquivado"
                    className={styles.option}
                >
                    Arquivado
                </option>
            </select>
    );
}
