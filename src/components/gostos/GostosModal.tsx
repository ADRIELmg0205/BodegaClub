import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface GostosModalProps {
  onClose: () => void;
  idUsuarioClerk: string | null;
  isOpen: boolean;
}

const MAX_CHARACTERS = 3000;

const GostosModal: React.FC<GostosModalProps> = ({ onClose, idUsuarioClerk, isOpen }) => {
  const [gostos, setGostos] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    const fetchGostos = async () => {
      const usuarioId = idUsuarioClerk || userId;
      if (!usuarioId) {
        console.error('ID do usuário não encontrado');
        return;
      }

      try {
        const response = await fetch(`/api/gostos/gostos?id_usuario_clerk=${usuarioId}`);
        if (response.ok) {
          const data = await response.json();
          setGostos(data.gostos || '');
        } else {
          console.error('Erro ao buscar gostos:', response.statusText);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    if (isOpen) {
      fetchGostos();
    }
  }, [isOpen, idUsuarioClerk, userId]);

  const handleSave = async () => {
    try {
      const usuarioId = idUsuarioClerk || userId;

      if (!usuarioId) {
        console.error('ID do usuário não encontrado');
        return;
      }

      const response = await fetch('/api/gostos/gostos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuarioClerk: usuarioId,
          gostos,
        }),
      });

      if (response.ok) {
        alert('Gostos salvos com sucesso!');
        onClose();
      } else {
        console.error('Erro ao salvar gostos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setGostos(text);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <h2 className="text-xl font-bold mb-4">Descreva seus Gostos:</h2>
        <h2 className="text-x mb-4">O Bodega Box foi pensado para atender o gosto de todos os tipos de clientes.</h2>
        <h2 className="text-x mb-4">Para uma melhor experiência na plataforma você pode estar informando seus gostos pessoais quanto as bebidas do clube que assinou.</h2>
        <textarea
          value={gostos}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Digite seus gostos aqui..."
          rows={5} // Define a altura do campo
        />
        <div className="text-right text-sm text-gray-500 mb-4">
          {gostos.length}/{MAX_CHARACTERS} caracteres
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GostosModal;
