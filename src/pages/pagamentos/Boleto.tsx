import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../images/Boleto.png'; // Ajuste o caminho conforme necessário
import { useRouter } from 'next/router';
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import BottomHeader from "@/components/header/BottomHeader";
const bwipjs = require('bwip-js');
  
  const BoletoLayout: React.FC = () => {
    const boletoRef = useRef<HTMLDivElement>(null);
    const barcodeRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const { sacado, endereco, cpf, valorDocumento, dataDocumento, dataVencimento, descricao } = router.query;

  
    const boletoData = {
      banco: "001 - Banco da Bodega",
      localPagamento: "PAGÁVEL EM QUALQUER BANCO",
      dataVencimento: dataVencimento,
      beneficiario: "BODEGA CLUB",
      cnpjBeneficiario: "00.000.000/0001-00",
      agencia: "1234-5",
      conta: "12345-6",
      dataDocumento: dataDocumento, // Usando a prop
      numeroDocumento: "123456",
      especieDocumento: "DM",
      aceite: "S",
      dataProcessamento: dataDocumento,
      nossoNumero: "1234567890",
      usoBanco: "",
      carteira: "01",
      especie: "R$",
      quantidade: "1",
      valor: "",
      valorDocumento: valorDocumento, // Usando a prop
      instrucoes: "Referente " + descricao + ". Pagar até a data de vencimento, multa de 2% após o vencimento." ,
      descricao: descricao,
      sacado: sacado, // Usando a prop
      endereco: endereco, // Usando a prop
      cpf: cpf, // Usando a prop
      codigoBaixa: "123456",
      linhaDigitavel: "00190.00009 12345.678901 23456.789012 3 56780000010000",
      codigoBarras: "00190000091234567890123456789012356780000010000",
      valorMulta: "R$ 0,00",
      desconto: "R$ 0,00",
      taxa: "R$ 0,00",
      valorCobrado: "R$ 0,00",
    };

  const generateBarcode = () => {
    const canvas = barcodeRef.current;
    if (canvas) {
      bwipjs.toCanvas(canvas, {
        bcid: 'interleaved2of5',
        text: boletoData.codigoBarras,
        scale: 1.5, // Diminuído para reduzir o tamanho
        height: 10, // Você pode ajustar isso também se necessário
        includetext: false,
      }, (err: Error | null) => {
        if (err) {
          console.error('Erro ao gerar código de barras: ', err);
        }
      });
    }
  };

  const generatePDF = () => {
    const boleto = boletoRef.current;
    if (boleto) {
      html2canvas(boleto).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("boleto.pdf");
      });
    }
  };

  React.useEffect(() => {
    if (sacado && endereco && cpf && valorDocumento && dataDocumento) {
    generateBarcode();
    }
  }, [sacado, endereco, cpf, valorDocumento, dataDocumento]);

  return (
    <main>

    <br></br><br></br>
    <div className="desktop-layout flex flex-col items-center">
      <div ref={boletoRef} className="border border-gray-500 w-full max-w-4xl bg-white p-4">
        {/* Header com logo do banco e número do boleto */}
        <div className="flex justify-between items-center border-b border-gray-500 pb-2">
          <div className="flex items-center">
            {/*<img src={logo.src} alt="Logo Banco" className="w-24 h-16" />*/}
            <span className="ml-4 text-sm font-bold">{boletoData.banco}</span>
          </div>
          <span className="text-base font-bold">{boletoData.linhaDigitavel}</span>
        </div>

        {/* Linha 1: Local de pagamento e vencimento */}
        <div className="flex justify-between">
          <div className="border p-2 w-3/4">
            <p className="text-xs font-bold">Local de Pagamento:</p>
            <p className="text-xs">{boletoData.localPagamento}</p>
          </div>
          <div className="border p-2 w-1/4">
            <p className="text-xs font-bold">Vencimento:</p>
            <p className="text-xs">{boletoData.dataVencimento}</p>
          </div>
        </div>

        {/* Linha 2: Beneficiário/CNPJ e Agência e Código do Beneficiário */}
        <div className="flex justify-between">
          <div className="border p-2 w-3/4">
            <p className="text-xs font-bold">Beneficiário:</p>
            <p className="text-xs">{boletoData.beneficiario} / {boletoData.cnpjBeneficiario}</p>
          </div>
          <div className="border p-2 w-1/4">
            <p className="text-xs font-bold">Agência:</p>
            <p className="text-xs">Agência: {boletoData.agencia} / Conta: {boletoData.conta}</p>
          </div>
        </div>

        {/* Linha 3: Data do documento, número do documento, espécie documento, aceite, data do processamento, nosso número */}
        <div className="flex justify-between">
            <div className="border p-2 w-1/6">
                <p className="text-xs font-bold">Data Documento:</p>
                <p className="text-xs">{boletoData.dataDocumento}</p>
            </div>
            <div className="border p-2 w-1/6">
                <p className="text-xs font-bold">Nº Documento:</p>
                <p className="text-xs">{boletoData.numeroDocumento}</p>
            </div>
            <div className="border p-2 w-1/6">
                <p className="text-xs font-bold">Espécie:</p>
                <p className="text-xs">{boletoData.especieDocumento}</p>
            </div>
            <div className="border p-2 w-1/7">
                <p className="text-xs font-bold">Aceite:</p>
                <p className="text-xs">{boletoData.aceite}</p>
            </div>
            <div className="border p-2 w-1/6">
                <p className="text-xs font-bold">Processamento:</p>
                <p className="text-xs">{boletoData.dataProcessamento}</p>
            </div>
            <div className="border p-2 w-1/4">
                <p className="text-xs font-bold">Nosso Número:</p>
                <p className="text-xs">{boletoData.nossoNumero}</p>
            </div>
        </div>

        {/* Linha 4: Uso do banco, Carteira, espécie, quantidade, valor, valor documento */}
        <div className="flex justify-between">
          <div className="border p-2 w-1/6">
            <p className="text-xs font-bold">Uso do Banco:</p>
            <p className="text-xs">{boletoData.usoBanco}</p>
          </div>
          <div className="border p-2 w-1/6">
            <p className="text-xs font-bold">Carteira:</p>
            <p className="text-xs">{boletoData.carteira}</p>
          </div>
          <div className="border p-2 w-1/7">
            <p className="text-xs font-bold">Espécie:</p>
            <p className="text-xs">{boletoData.especie}</p>
          </div>
          <div className="border p-2 w-1/6">
            <p className="text-xs font-bold">Quantidade:</p>
            <p className="text-xs">{boletoData.quantidade}</p>
          </div>
          <div className="border p-2 w-1/6">
            <p className="text-xs font-bold">Valor:</p>
            <p className="text-xs">{boletoData.valor}</p>
          </div>
          <div className="border p-2 w-1/4">
            <p className="text-xs font-bold">Valor Documento:</p>
            <p className="text-xs">R$ {boletoData.valorDocumento}</p>
          </div>
        </div>

        {/* Linha 5: Instruções */}
        <div className="flex justify-between ">
            <p className="text-xs font-bold">Instruções: </p>
            <p className="text-xs">{boletoData.instrucoes}</p>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br>
            <div className="w-1/4">
                <div className="border p-2">
                <p className="text-xs font-bold">Desconto:</p>
                <p className="text-xs">{boletoData.desconto}</p>
                </div>
                <div className="border p-2">
                <p className="text-xs font-bold">Multa:</p>
                <p className="text-xs">{boletoData.valorMulta}</p>
                </div>
                <div className="border p-2">
                <p className="text-xs font-bold">Taxa Bancaria:</p>
                <p className="text-xs">{boletoData.taxa}</p>
                </div>
                <div className="border p-2">
                <p className="text-xs font-bold">Valor Cobrado:</p>
                <p className="text-xs">{boletoData.valorCobrado}</p>
                </div>
          </div>
        </div>

        {/* Linha 6: Sacado */}
        <div className="border p-2 flex justify-between">
            <div className="w-1/2">
            <p className="text-xs font-bold">Pagador:</p>
            <p className="text-xs">{boletoData.sacado}</p>
            {/*<p className="text-xs">{boletoData.endereco}</p>*/}
            </div>
            <div className="w-1/4">
            <p className="text-xs font-bold">CPF/CNPJ:</p>
            <p className="text-xs">{boletoData.cpf}</p>
            <br></br>
            <p className="text-xs font-bold">Código de Baixa:</p>
            <p className="text-xs">{boletoData.codigoBaixa}</p>
            </div>
        </div>

        {/* Linha 8: Código de barras */}
        <div className="border p-2 my-2">
          
          <canvas ref={barcodeRef} style={{ width: '400px', height: '50px' }} /> {/* Ajuste o tamanho do canvas */}
        </div>
      
      </div>
      <button onClick={generatePDF} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Gerar PDF
      </button>
      <br></br><br></br>
    </div>

    </main>
  );
};

export default BoletoLayout;
