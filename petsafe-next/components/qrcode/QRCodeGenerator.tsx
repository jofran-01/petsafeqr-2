// components/qrcode/QRCodeGenerator.tsx
import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  petId: string;
  petName: string;
  baseUrl: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ petId, petName, baseUrl }) => {
  // URL completa para a página pública do animal
  const publicUrl = `${baseUrl}/p/${petId}`;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCode 
          value={publicUrl}
          size={250}
          level="H"
          includeMargin={true}
          renderAs="svg"
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">Escaneie para acessar informações de {petName}</p>
      <p className="mt-2 text-xs text-gray-400 break-all">{publicUrl}</p>
    </div>
  );
};

export default QRCodeGenerator;
