import { doacao, site } from '../../data/content'
import { variacoesTexto } from '../../store/lojas'

// Declaração de Conteúdo dos Correios (para envio sem nota fiscal), já
// preenchida com o pedido, numa janela pronta para imprimir e assinar.
// Segue o modelo oficial dos Correios: remetente, destinatário, bens, totais,
// declaração, data e assinatura.

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
const brl = (v) => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const cep = (v) => {
  const d = String(v || '').replace(/\D/g, '')
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}
const doc = (v) => {
  const d = String(v || '').replace(/\D/g, '')
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return d
}
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

export function abrirDeclaracao({ pedido: o, settings = {}, peso }) {
  const r = settings.remetente || {}
  const rem = {
    nome: r.nome || doacao.titular,
    endereco: [[r.rua, r.numero].filter(Boolean).join(', '), r.complemento, r.bairro].filter(Boolean).join(' — ') || settings.endereco || site.endereco,
    cidade: `${r.cidade || 'Breves'}/${(r.uf || 'PA').toUpperCase()}`,
    cep: cep(r.cep || settings.freteCepOrigem || '68800000'),
    doc: doc(r.documento || doacao.cnpj),
  }
  const e = o.enderecoDetalhado || {}
  const des = {
    nome: o.cliente?.nome || '',
    endereco: e.rua ? [[e.rua, e.numero].filter(Boolean).join(', '), e.complemento, e.bairro].filter(Boolean).join(' — ') : o.endereco || '',
    cidade: e.cidade ? `${e.cidade}/${e.uf || ''}` : '',
    cep: cep(e.cep),
    doc: doc(o.cliente?.cpf),
  }
  const itens = o.itens || []
  const qtdTotal = itens.reduce((s, i) => s + (Number(i.qtd) || 0), 0)
  const valorTotal = itens.reduce((s, i) => s + Number(i.preco) * Number(i.qtd), 0)
  const hoje = new Date()
  const data = `${r.cidade || 'Breves'}, ${hoje.getDate()} de ${MESES[hoje.getMonth()]} de ${hoje.getFullYear()}`
  const pesoTxt = Number(peso) > 0 ? `${String(peso).replace('.', ',')} kg` : ''

  const pessoa = (titulo, p) => `
    <table class="bloco">
      <tr><th colspan="4">${titulo}</th></tr>
      <tr><td class="r">NOME:</td><td colspan="3">${esc(p.nome)}</td></tr>
      <tr><td class="r">ENDEREÇO:</td><td colspan="3">${esc(p.endereco)}</td></tr>
      <tr><td class="r">CIDADE/UF:</td><td>${esc(p.cidade)}</td><td class="r">CEP:</td><td>${esc(p.cep)}</td></tr>
      <tr><td class="r">CPF/CNPJ:</td><td colspan="3">${esc(p.doc)}</td></tr>
    </table>`

  const linhas = itens
    .map(
      (i, k) => `<tr><td class="c">${k + 1}</td><td>${esc(i.nome)}${variacoesTexto(i) ? ` (${esc(variacoesTexto(i, ', '))})` : ''}</td><td class="c">${esc(i.qtd)}</td><td class="n">${brl(Number(i.preco) * Number(i.qtd))}</td></tr>`
    )
    .join('')
  // Linhas em branco para completar a tabela (como no formulário oficial).
  const vazias = Array.from({ length: Math.max(0, 6 - itens.length) }, () => '<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>').join('')

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Declaração de Conteúdo — ${esc(o.numero)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 12px; margin: 0; padding: 16px; }
  h1 { text-align: center; font-size: 18px; margin: 0 0 4px; letter-spacing: .5px; }
  .sub { text-align: center; font-size: 11px; margin: 0 0 12px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th, td { border: 1px solid #000; padding: 5px 6px; vertical-align: top; }
  th { background: #e9e9e9; text-align: center; font-size: 12px; }
  td.r { width: 1%; white-space: nowrap; font-weight: bold; font-size: 11px; }
  td.c { text-align: center; width: 1%; white-space: nowrap; }
  td.n { text-align: right; width: 1%; white-space: nowrap; }
  .duas { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .duas table { margin-bottom: 0; }
  .decl { border: 1px solid #000; padding: 8px 10px; text-align: justify; line-height: 1.45; margin-bottom: 10px; }
  .decl b { display: block; text-align: center; margin-bottom: 6px; }
  .ass { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-top: 26px; }
  .ass div { flex: 1; text-align: center; }
  .linha { border-top: 1px solid #000; padding-top: 4px; font-size: 11px; }
  .obs { font-size: 10px; margin-top: 14px; border: 1px solid #000; padding: 6px 8px; }
  .barra { position: sticky; top: 0; background: #0b2a4a; color: #fff; padding: 10px 14px; margin: -16px -16px 16px; display: flex; gap: 12px; align-items: center; justify-content: space-between; font-size: 13px; }
  .barra button { background: #12a0e6; color: #fff; border: 0; border-radius: 8px; padding: 9px 16px; font-weight: bold; font-size: 14px; cursor: pointer; }
  @media print { .barra { display: none; } body { padding: 0; } }
  @media (max-width: 640px) { .duas { grid-template-columns: 1fr; } }
</style></head><body>
<div class="barra"><span>Imprima, <b>assine</b> e cole do lado de fora do pacote (num saquinho plástico).</span><button onclick="window.print()">Imprimir</button></div>
<h1>DECLARAÇÃO DE CONTEÚDO</h1>
<p class="sub">Pedido ${esc(o.numero)}</p>
<div class="duas">${pessoa('REMETENTE', rem)}${pessoa('DESTINATÁRIO', des)}</div>
<table style="margin-top:10px">
  <tr><th colspan="4">IDENTIFICAÇÃO DOS BENS</th></tr>
  <tr><th>ITEM</th><th>CONTEÚDO</th><th>QUANT.</th><th>VALOR</th></tr>
  ${linhas}${vazias}
  <tr><td colspan="2" style="text-align:right"><b>TOTAIS</b></td><td class="c"><b>${qtdTotal}</b></td><td class="n"><b>${brl(valorTotal)}</b></td></tr>
  <tr><td colspan="2" style="text-align:right"><b>PESO TOTAL (kg)</b></td><td colspan="2">${esc(pesoTxt)}</td></tr>
</table>
<div class="decl">
  <b>DECLARAÇÃO</b>
  Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, ainda que se iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da legislação tributária vigente, responsabilizando-me, nos termos da lei e a quem de direito, por informações inverídicas.
  <br><br>
  Declaro ainda que não estou postando conteúdo inflamável, explosivo, causador de combustão espontânea, tóxico, corrosivo, gás ou qualquer outro conteúdo que constitua perigo, conforme o art. 13 da Lei Postal nº 6.538/78.
</div>
<div class="ass">
  <div><div class="linha">${esc(data)}</div></div>
  <div><div class="linha">Assinatura do Declarante/Remetente</div></div>
</div>
<p class="obs"><b>OBSERVAÇÃO:</b> Constitui crime contra a ordem tributária suprimir ou reduzir tributo, ou contribuição social e qualquer acessório (Lei 8.137/90, Art. 1º, V).</p>
</body></html>`

  const w = window.open('', '_blank')
  if (!w) return false // navegador bloqueou a janela
  w.document.open()
  w.document.write(html)
  w.document.close()
  return true
}
