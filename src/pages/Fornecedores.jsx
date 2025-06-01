import './Fornecedores.css';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Fornecedores() {
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
        nome: '',
        CPFouCNPJ: '',
        dataCadastro: ''
    });

    const [fornecedores, setFornecedores] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7177/api/fornecedores')
            .then(res => res.json())
            .then(data => { setFornecedores(data); })
            .catch(err => console.error('Erro ao buscar fornecedores:', err));
    }, []);


    const handleDeletar = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Tem certeza que deseja confirmar essa exclusão desse fornecedor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e94b3c',
            cancelButtonColor: '#4a90e2',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://localhost:7177/api/fornecedores/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        setFornecedores(current => current.filter(f => f.id !== id));
                        Swal.fire('Deletado!', 'O fornecedor foi deletado com sucesso.', 'success');
                    }
                    else {
                        Swal.fire('Erro!', 'Não foi possível deletar o fornecedor.', 'error');
                    }
                } catch (err) {
                    Swal.fire('Erro!', 'Erro ao se conectar com o servidor.', 'error');
                }
            }
        });
    };

    const fornecedoresFiltrados = fornecedores.filter(f =>
        f.nome?.toLowerCase().includes(filtros.nome.toLowerCase()) &&
        f.cpFouCNPJ?.includes(filtros.CPFouCNPJ) &&
        (filtros.dataCadastro === '' || new Date(f.dataCadastro).toISOString().slice(0, 10) === filtros.dataCadastro)
    );

    function formatarCNPJ(cnpj) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    return (
        <div className="fornecedores-container">
            <button className="btn-voltar" onClick={() => navigate('/')} aria-label="Voltar para a Home">
                <FaArrowLeft />
            </button>

            <h1>Fornecedores</h1>

            <div className="filtros">
                <input type="text" placeholder="Filtrar por Nome" value={filtros.nome} onChange={e => setFiltros({ ...filtros, nome: e.target.value })} />
                <input type="text" placeholder="Filtrar por CPF/CNPJ" value={filtros.CPFouCNPJ} onChange={e => setFiltros({ ...filtros, CPFouCNPJ: e.target.value })} />
                <input type="date" value={filtros.dataCadastro} onChange={e => setFiltros({ ...filtros, dataCadastro: e.target.value })} />
            </div>

            <button className="btn-cadastrar" onClick={() => navigate('/fornecedores/cadastrar')}> Cadastrar Fornecedor </button>

            <table className="fornecedores-tabela">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF/CNPJ</th>
                        <th>Tipo</th>
                        <th>Data Cadastro</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>

                <tbody>
                    {fornecedoresFiltrados.map(f => (
                        <tr key={f.id}>
                            <td>{f.nome}</td>
                            <td>{formatarCNPJ(f.cpFouCNPJ)}</td>
                            <td>{f.pessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                            <td>{new Date(f.dataCadastro).toLocaleDateString('pt-BR')}</td>

                            <td>
                                <button className="btn-acao" onClick={() => navigate('/fornecedores/form', { state: { fornecedor: f } })}> <FaEdit color="#4a90e2" /> </button>

                            </td>

                            <td>
                                <button className="btn-acao" onClick={() => handleDeletar(f.id)}> <FaTrash color="#e94b3c" /> </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}