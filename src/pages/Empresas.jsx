import './Empresas.css';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Empresas() {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7177/api/empresas')
            .then(res => res.json())
            .then(data => setEmpresas(data))
            .catch(err => console.error('Erro ao buscar empresas:', err));
    }, []);

    const handleDeletar = async (id) => {
        await fetch(`https://localhost:7177/api/empresas/${id}`, {
            method: 'DELETE'
        });
        setEmpresas(empresas.filter(e => e.id !== id));
    };

    function formatarCNPJ(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    return (
        <div className="empresas-container">
            <button className="btn-voltar" onClick={() => navigate('/')} aria-label="Voltar para a Home">
                <FaArrowLeft />
            </button>

            <h1>Empresas</h1>
            <button className="btn-cadastrar" onClick={() => navigate('/empresas/cadastrar')}>
                Cadastrar
            </button>

            <table className="empresas-tabela">
                <thead>
                    <tr>
                        <th>Nome Fantasia</th>
                        <th>CNPJ</th>
                        <th>UF</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((empresa) => (
                        <tr key={empresa.id}>
                            <td>{empresa.nomeFantasia}</td>
                            <td>{formatarCNPJ(empresa.cnpj)}</td>
                            <td>{empresa.uf}</td>
                            <td>
                                <button
                                    aria-label="Editar"
                                    className="btn-acao"
                                    onClick={() =>
                                        navigate(`/empresas/editar/${empresa.id}`, {
                                            state: { empresa }
                                        })
                                    }
                                >
                                    <FaEdit color="#4a90e2" />
                                </button>
                            </td>
                            <td>
                                <button
                                    aria-label="Deletar"
                                    className="btn-acao"
                                    onClick={() => handleDeletar(empresa.id)}
                                >
                                    <FaTrash color="#e94b3c" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}