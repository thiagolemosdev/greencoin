import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/marketplace')({
  component: MarketplacePage,
});

function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace OTC</h1>
        <p className="text-gray-600">Encontre ofertas disponíveis de outros usuários</p>
      </div>
      {/* Filtros e lista de ofertas */}
      <p>Marketplace - em desenvolvimento</p>
    </div>
  );
}
