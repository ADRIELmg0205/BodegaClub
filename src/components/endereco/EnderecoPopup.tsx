import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

interface Endereco {
  cep_endereco: string;
  estado_endereco: string;
  cidade_endereco: string;
  bairro_endereco: string;
  rua_endereco: string;
  numero_endereco: string;
  complemento_endereco: string;
}

interface EnderecoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endereco: Endereco) => void;
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function EnderecoPopup({ isOpen, onClose, onSave }: EnderecoPopupProps) {
  const { user } = useUser();
  const [endereco, setEndereco] = useState<Endereco>({
    cep_endereco: '',
    estado_endereco: '',
    cidade_endereco: '',
    bairro_endereco: '',
    rua_endereco: '',
    numero_endereco: '',
    complemento_endereco: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchEndereco = async () => {
        try {
          setLoading(true);
          const response = await axios.get('/api/endereco/Endereco', {
            params: { id_usuario_clerk: user?.id },
          });

          if (response.data) {
            const enderecoData = response.data.data;
            setEndereco({
              cep_endereco: enderecoData.cep_endereco || '',
              estado_endereco: enderecoData.estado_endereco || '',
              cidade_endereco: enderecoData.cidade_endereco || '',
              bairro_endereco: enderecoData.bairro_endereco || '',
              rua_endereco: enderecoData.rua_endereco || '',
              numero_endereco: enderecoData.numero_endereco || '',
              complemento_endereco: enderecoData.complemento_endereco || '',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEndereco();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    const allFieldsFilled = 
      endereco.cep_endereco.length === 8 &&  // Verifica se o CEP tem 8 dígitos
      endereco.estado_endereco !== '' &&
      endereco.cidade_endereco !== '' &&
      endereco.bairro_endereco !== '' &&
      endereco.rua_endereco !== '' &&
      endereco.numero_endereco !== '';  // Verifica se o número também está preenchido corretamente

    setIsSaveButtonEnabled(allFieldsFilled);
  }, [endereco]);

  const handleSave = async () => {
    try {
      await axios.post('/api/endereco/Endereco', {
        id_usuario_clerk: user?.id,
        ...endereco,
      });
      onSave(endereco);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validação para campo CEP e número, aceitando apenas números
    if (name === 'cep_endereco' || name === 'numero_endereco') {
      const numericValue = value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
      if (numericValue.length <= 8) {
        setEndereco({ ...endereco, [name]: numericValue });
      }
    } else {
      // Limita os outros campos a 50 caracteres
      if (value.length <= 50) {
        setEndereco({ ...endereco, [name]: value });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Endereço de Entrega</h2>
        {loading ? (
          <p>Carregando endereço...</p>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">CEP</label>
              <input
                type="text"
                name="cep_endereco"
                placeholder="CEP"
                value={endereco.cep_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={8} // Limita a entrada a 8 caracteres para o CEP
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">UF</label>
              <select
                name="estado_endereco"
                value={endereco.estado_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Selecione um estado</option>
                {estadosBrasil.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Cidade</label>
              <input
                type="text"
                name="cidade_endereco"
                placeholder="Cidade"
                value={endereco.cidade_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={50} // Limite de 50 caracteres
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Bairro</label>
              <input
                type="text"
                name="bairro_endereco"
                placeholder="Bairro"
                value={endereco.bairro_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={50} // Limite de 50 caracteres
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Rua</label>
              <input
                type="text"
                name="rua_endereco"
                placeholder="Rua"
                value={endereco.rua_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={50} // Limite de 50 caracteres
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Número</label>
              <input
                type="text"
                name="numero_endereco"
                placeholder="Número"
                value={endereco.numero_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={8} // Limita a entrada a 8 dígitos para o número
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Complemento</label>
              <input
                type="text"
                name="complemento_endereco"
                placeholder="Complemento"
                value={endereco.complemento_endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={50} // Limite de 50 caracteres
              />
            </div>
          </form>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleSave}
            disabled={!isSaveButtonEnabled}
            className={`py-2 px-4 rounded ${
              isSaveButtonEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            Confirmar
          </button>
          <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
