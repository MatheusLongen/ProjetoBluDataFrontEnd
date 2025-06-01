import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
        <h1 className="title">Sistema de Fornecedores</h1>
        <button className="btn-cadastrar" onClick={() => navigate('/empresas')}>
            Ir para Empresas
        </button>

        <button className="btn-cadastrar" onClick={() => navigate('/fornecedores')}>
            Ir para Fornecedores
        </button>
    </div>
  );
}