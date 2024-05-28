export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Libro Mayor</h1>
          <a
            href="/files/LibroMayor.pdf"
            download="LibroMayor.pdf"
            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Descargar
          </a>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Balance de Saldos y Cuentas</h1>
          <a
            href="/files/BalanceAmounts.pdf"
            download="BalanceAmounts.pdf"
            className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            Descargar
          </a>
        </div>
      </div>
    </div>
  );
}
