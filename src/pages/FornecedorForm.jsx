import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { toast } from 'react-toastify';
import './FornecedorForm.css';

export default function FornecedorForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const [empresas, setEmpresas] = useState([]);

    const [fornecedor, setFornecedor] = useState({
        id: 0,
        nome: '',
        tipo: 'Física',
        cpfCnpj: '',
        dataCadastro: '',
        rg: '',
        dataNascimento: '',
        telefones: [''],
        empresaId: 0
    });

    useEffect(() => {
        fetch('https://localhost:7177/api/empresas')
            .then(res => res.json())
            .then(data => setEmpresas(data))
            .catch(err => console.error('Erro ao carregar empresas:', err));
    }, []);

    useEffect(() => {
        if (location.state?.fornecedor) {
            const formatDate = (iso) => iso ? iso.split('T')[0] : '';

            setFornecedor({
                ...location.state.fornecedor,
                tipo: location.state.fornecedor.pessoaFisica ? 'Física' : 'Jurídica',
                cpfCnpj: location.state.fornecedor.cpfCnpj || location.state.fornecedor.cpFouCNPJ,
                dataCadastro: formatDate(location.state.fornecedor.dataCadastro),
                dataNascimento: formatDate(location.state.fornecedor.dataNascimento),
                empresaId: location.state.fornecedor.empresaId,
                telefones: location.state.fornecedor.telefones.length ? 
                    location.state.fornecedor.telefones.map(t => ({ id: t.id || 0, numero: t.numero || t })) : [{ id: 0, numero: '' }]
            });
        } else {
            const hoje = new Date().toISOString().split('T')[0];
            setFornecedor(prev => ({ ...prev, dataCadastro: hoje }));
        }
    }, [location.state]);

    const handleTelefoneChange = (index, value) => {
        const novos = [...fornecedor.telefones];
        novos[index] = { ...novos[index], numero: value };
        setFornecedor({ ...fornecedor, telefones: novos });
    };

    const adicionarTelefone = () => {
        setFornecedor({
            ...fornecedor,
            telefones: [...fornecedor.telefones, { id: 0, numero: '' }]
        });
    };

    const removerTelefone = (index) => {
        const novos = fornecedor.telefones.filter((_, i) => i !== index);
        setFornecedor({ ...fornecedor, telefones: novos });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = fornecedor.id ? 'PUT' : 'POST';
            const url = fornecedor.id ? `https://localhost:7177/api/fornecedores/${fornecedor.id}` : 'https://localhost:7177/api/fornecedores';

            const dadosParaSalvar = {
            Id: fornecedor.id,
            EmpresaId: fornecedor.empresaId,
            Nome: fornecedor.nome,
            CPFouCNPJ: fornecedor.cpfCnpj,
            DataCadastro: fornecedor.dataCadastro,
            PessoaFisica: fornecedor.tipo === 'Física',
            RG: fornecedor.rg,
            DataNascimento: fornecedor.dataNascimento || null,
            Telefones: fornecedor.telefones
                .filter(t => (typeof t === 'object' ? t.numero?.trim() !== '' : t.trim() !== ''))
                .map(t =>
                typeof t === 'object'
                    ? { Id: t.id || 0, Numero: t.numero }
                    : { Id: 0, Numero: t }
                )
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaSalvar)
            });

            if (response.ok) {
                navigate('/fornecedores');
            } else {
                const errorJson = await response.json();

                if (errorJson.message) {
                    toast.error(errorJson.message);
                } else {
                    toast.error('Erro ao salvar fornecedor');
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const mask = fornecedor.tipo === 'Física' ? '000.000.000-00' : '00.000.000/0000-00';

    return (
        <div className="fornecedor-form-container">
            <h2>{fornecedor.id ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h2>
            <form className="fornecedor-form" onSubmit={handleSubmit}>

                <label>
                    Empresa:
                    <select
                        value={fornecedor.empresaId}
                        onChange={e => setFornecedor({ ...fornecedor, empresaId: Number(e.target.value) })}
                        required
                    >
                        <option value="">Selecione uma empresa</option>
                        {empresas.map(empresa => (
                            <option key={empresa.id} value={empresa.id}>
                                {empresa.nomeFantasia}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Nome:
                    <input type="text" value={fornecedor.nome} onChange={e => setFornecedor({ ...fornecedor, nome: e.target.value })} required />
                </label>

                <label>
                    Tipo:
                    <select value={fornecedor.tipo} onChange={e => setFornecedor({ ...fornecedor, tipo: e.target.value })}>
                        <option value="Física">Física</option>
                        <option value="Jurídica">Jurídica</option>
                    </select>
                </label>

                <label>
                    CPF/CNPJ:
                    <IMaskInput mask={mask} value={fornecedor.cpfCnpj} onAccept={value => setFornecedor({ ...fornecedor, cpfCnpj: value })} required />
                </label>

                <label>
                    Data de Cadastro:
                    <input type="date" value={fornecedor.dataCadastro} />
                </label>

                {fornecedor.tipo === 'Física' && (
                    <>
                        <label>
                            RG:
                            <IMaskInput
                                mask="0.000.000"
                                value={fornecedor.rg}
                                onAccept={value => setFornecedor({ ...fornecedor, rg: value })}
                            />
                        </label>

                        <label>
                            Data de Nascimento:
                            <input type="date" value={fornecedor.dataNascimento} onChange={e => setFornecedor({ ...fornecedor, dataNascimento: e.target.value })} />
                        </label>
                    </>
                )}

                <div className="telefones">
                    <label>Telefones:</label>

                    {fornecedor.telefones.map((tel, index) => (
                        <div key={index} className="telefone-item">
                            <IMaskInput mask="(00) 00000-0000" value={tel.numero || ''} onAccept={value => handleTelefoneChange(index, value)} />

                            {fornecedor.telefones.length > 1 && (
                                <button type="button" onClick={() => removerTelefone(index)}> Remover </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={adicionarTelefone}>Adicionar Telefone</button>
                </div>

                <div className="form-botoes">
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => navigate('/fornecedores')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}