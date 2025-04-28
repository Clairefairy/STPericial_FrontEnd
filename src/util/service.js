import axios from "axios";

const api = axios.create({
    baseURL: "https://stpericial-back-end.onrender.com/api/"
});


export const login = async (url, dados, setDados) => {
    const resposta = await api.post(url, dados);
  setDados(resposta.data);
};

export const buscar = async (url, setDados, header) => {
    
    const resposta = await api.get(url, header);
    if (typeof setDados === "function" && setDados) setDados(resposta.data);
    return resposta.data
};


export const downloadArquivo = async (url, nomeArquivo = 'arquivo', header = {}) => {
    try {
        const config = {
            ...header,
            responseType: 'blob'
        };

        const resposta = await api.get(url, config);

        const contentDisposition = resposta.headers['content-disposition'];
        let nomeDoArquivo = nomeArquivo;

        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match && match[1]) {
                nomeDoArquivo = match[1].replace(/['"]/g, '');
            }
        }

        const urlDownload = window.URL.createObjectURL(new Blob([resposta.data]));
        const link = document.createElement('a');
        link.href = urlDownload;
        link.setAttribute('download', nomeDoArquivo);
        document.body.appendChild(link);
        link.click();

        setTimeout(() => { 
            link.remove();
            window.URL.revokeObjectURL(urlDownload);
        }, 100);

        return true; 
    } catch (erro) {
        console.error('Erro ao baixar arquivo:', erro);
        return false;
    }
};

export const buscarEvidencia = async (url, idCaso, setDados, header) => {
    const resposta = await api.get(url, header);
    const evidenciasFiltradas = resposta.data.filter(evidencia => evidencia.case === idCaso);
    setDados(evidenciasFiltradas);
    return evidenciasFiltradas;
};



export const cadastrar = async (url, dados, setDados, header) => {
    const resposta = await api.post(url, dados, header);
    if (typeof setDados === "function") setDados(resposta.data);
    return resposta.data
};

export const atualizar = async (url, dados, setDados, header) => {
    const resposta = await api.put(url, dados, header);
    if (typeof setDados === "function") setDados(resposta.data);
    return resposta.data

};

export const deletar = async (url, header) => {
    await api.delete(url, header);
};



export const cadastrarMultipart = async (url, formData, token) => {

    try {
        const resposta = await fetch("https://stpericial-back-end.onrender.com/api" +url, {
            method: 'POST',
            headers: {
                Authorization: token
            },
            body: formData
        });


        const data = await resposta.json();

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.data}`);
        }

        return data;
    } catch (error) {
        console.error("Erro ao enviar multipart form:", error);
        throw error;
    }
};





export const atualizarMultipart = async (url, formData, token) => {

    try {
        const resposta = await fetch("https://stpericial-back-end.onrender.com/api" + url , {
            method: 'PUT',
            headers: {
                Authorization: token
            },
            body: formData
        });


        const data = await resposta.json();

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.data}`);
        }

        return data;
    } catch (error) {
        console.error("Erro ao enviar multipart form:", error);
        throw error;
    }
};

