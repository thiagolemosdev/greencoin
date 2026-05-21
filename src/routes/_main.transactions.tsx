import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/transactions')({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Transações</h1>
        <p className="text-gray-600">Acompanhe o histórico de suas transações</p>
      </div>
      {/* Lista de transações */}
      <p>Lista de transações - em desenvolvimento</p>
    </div>
  );
}
