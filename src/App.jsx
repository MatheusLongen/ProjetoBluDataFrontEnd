import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Empresas from './pages/Empresas';
import EmpresaForm from './pages/EmpresaForm';
import Fornecedores from './pages/Fornecedores';
import FornecedorForm from './pages/FornecedorForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/empresas/cadastrar" element={<EmpresaForm />} />
        <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/fornecedores/cadastrar" element={<FornecedorForm />} />
        <Route path="/fornecedores/form" element={<FornecedorForm />} />
      </Routes>
    </>
  );
}