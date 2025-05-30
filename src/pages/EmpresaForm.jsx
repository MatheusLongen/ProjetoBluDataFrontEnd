import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './EmpresaForm.css';

export default function EmpresaForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [empresa, setEmpresa] = useState({
        nomeFantasia: '',
        cnpj: '',
        uf: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!empresa.nomeFantasia) {
            toast.error("Nome da Empresa é obrigatório");
            return;
        }
        else if(!empresa.cnpj) {
            toast.error("CNPJ é obrigatório")
        }
        else if(!empresa.uf) {
            toast.error("UF é obrigatório")
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `https://localhost:7177/api/empresas/${id}` : 'https://localhost:7177/api/empresas';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empresa),
        });

        if (!response.ok) {
            const data = await response.json();
            toast.error(data.message);
            return;
        }

        navigate('/empresas');
    };

    useEffect(() => {
        if (id) {
            fetch(`https://localhost:7177/api/empresas/${id}`)
            .then(res => res.json())
            .then(data => setEmpresa(data))
            .catch(err => console.error('Erro ao buscar empresa:', err));
        } else if (location.state?.empresa) {
            setEmpresa(location.state.empresa);
        }
    }, [id, location.state]);

    return (
        <div className="empresa-form-container">
            <h2>Cadastrar Empresa</h2>
            <form className="empresa-form" onSubmit={handleSubmit}>
                <label>
                    Nome da Empresa:
                    <input type="text" placeholder="Nome da Empresa" value={empresa.nomeFantasia} onChange={e => setEmpresa({...empresa, nomeFantasia: e.target.value})} />
                </label>

                <label>
                    CNPJ:
                    <IMaskInput mask="00.000.000/0000-00" placeholder="00.000.000/0000-00" unmask={false} value={empresa.cnpj} 
                    onChange={e => setEmpresa({...empresa, cnpj: e.target.value})}/>
                </label>

                <label>
                    UF:
                    <input type="text" placeholder="Ex: SP" maxLength={2} style={{ textTransform: 'uppercase' }} value={empresa.uf}  
                    onChange={e => setEmpresa({...empresa, uf: e.target.value})} />
                </label>

                <div className="form-botoes">
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => navigate('/empresas')}> Cancelar </button>
                </div>
            </form>
        </div>
    );
}