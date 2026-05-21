import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/wallet/create')({
  component: CreateWalletPage,
});

function CreateWalletPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Criar Nova Carteira</h2>
      {/* Componente de formulário será adicionado aqui */}
      <p>Formulário de criação de carteira - em desenvolvimento</p>
    </div>
  );
}
