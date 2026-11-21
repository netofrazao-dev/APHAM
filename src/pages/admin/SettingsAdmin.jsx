import { useEffect, useRef, useState } from 'react'
import { Save, Download, Upload, RotateCcw, Check, Database, UploadCloud, Truck } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatarCep } from '../../store/entrega'
import { buscarFrete, prazoTexto } from '../../store/frete'
import { formatBRL } from '../../store/format'
import { PageTitle, Card, Field, inputCls, btnPrimary, btnGhost } from './ui'

// Iguais aos de api/_lib/frete.js (o servidor usa estes quando o campo está vazio).
const PACOTE_PADRAO = { peso: 0.3, altura: 4, largura: 20, comprimento: 30 }
const MEDIDAS_PACOTE = [
  ['peso', 'Peso (kg)', '0.01'],
  ['altura', 'Altura (cm)', '1'],
  ['largura', 'Largura (cm)', '1'],
  ['comprimento', 'Comprimento (cm)', '1'],
]

// Explica o preço: o pacote enviado ao Melhor Envio e o que ele devolveu.
function DetalheFrete({ d }) {
  const p = d.enviado?.[0]
  return (
    <details className="mt-3 text-xs text-navy-600">
      <summary className="cursor-pointer font-semibold text-navy-700">Por que esse preço? (detalhes)</summary>
      <div className="mt-2 space-y-1">
        <p>
          De {formatarCep(d.origem)} para {formatarCep(d.destino)}.
          {p && ` Pacote do produto: ${p.weight} kg · ${p.height} × ${p.width} × ${p.length} cm.`}
          {' '}Seguro: {d.seguro ? 'ligado' : 'desligado'}. Taxa de embalagem: {formatBRL(d.adicional || 0)}.
        </p>
        {(d.melhorEnvio || []).map((s) => (
          <p key={s.nome}>
            {s.nome}: {s.erro ? `não atende (${s.erro})` : `Melhor Envio cobra ${formatBRL(Number(s.custom_price ?? s.price))}`}
            {s.pacotes?.[0] && ` · calculado como ${s.pacotes[0].peso} kg, ${s.pacotes[0].height} × ${s.pacotes[0].width} × ${s.pacotes[0].length} cm`}
          </p>
        ))}
        <p className="text-navy-400">
          O preço dos Correios sobe com o peso e com o tamanho da caixa (peso cúbico: altura × largura × comprimento ÷ 6000). Confira o peso e as medidas no cadastro do produto e a embalagem padrão acima.
        </p>
      </div>
    </details>
  )
}

// Cota um CEP com o primeiro produto da loja e mostra o resultado ou o motivo da falha.
function TesteFrete() {
  const { produtosVitrine } = useStore()
  const [cep, setCep] = useState('66015-250')
  const [res, setRes] = useState(null)
  const [testando, setTestando] = useState(false)
  const produto = produtosVitrine?.[0]
  const testar = async () => {
    if (!produto) return setRes({ opcoes: [], motivo: 'Cadastre um produto para testar.' })
    setTestando(true)
    setRes(await buscarFrete(cep, [{ id: produto.id, qtd: 1 }], { diagnostico: true }))
    setTestando(false)
  }
  return (
    <div className="mt-4 rounded-xl border border-navy-100 bg-paper p-3">
      <p className="mb-2 text-sm font-semibold text-navy-800">Testar o frete{produto ? ` (1× ${produto.nome})` : ''}</p>
      <div className="flex gap-2">
        <input inputMode="numeric" value={cep} onChange={(e) => setCep(formatarCep(e.target.value))} className={`${inputCls} max-w-[10rem]`} aria-label="CEP para testar" />
        <button type="button" onClick={testar} disabled={testando} className={btnGhost}>
          {testando ? 'Testando…' : 'Testar'}
        </button>
      </div>
      {res &&
        (res.opcoes.length ? (
          <ul className="mt-2 space-y-1 text-sm text-navy-700">
            {res.opcoes.map((o) => (
              <li key={o.id}>
                ✓ {o.nome}: <strong>{formatBRL(o.preco)}</strong> {o.prazo ? `(${prazoTexto(o.prazo)})` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm font-medium text-amber-700">Sem cotação: {res.motivo || 'motivo desconhecido.'}</p>
        ))}
      {res?.detalhe && <DetalheFrete d={res.detalhe} />}
    </div>
  )
}

// Dados de quem envia (vão na etiqueta). [campo, rótulo, exemplo, colunas]
const CAMPOS_REMETENTE = [
  ['nome', 'Nome', 'Se vazio: APHAM', 'sm:col-span-3'],
  ['documento', 'CNPJ', 'Se vazio: 11.089.865/0001-92', 'sm:col-span-3'],
  ['telefone', 'Telefone *', 'Se vazio: o telefone do site', 'sm:col-span-3'],
  ['email', 'E-mail', 'Se vazio: o e-mail do site', 'sm:col-span-3'],
  ['cep', 'CEP', 'Se vazio: 68800-000', 'sm:col-span-2'],
  ['rua', 'Rua *', 'Ex.: Rua Presidente Vargas', 'sm:col-span-4'],
  ['numero', 'Número *', 'Ex.: 123 ou s/n', 'sm:col-span-2'],
  ['complemento', 'Complemento', 'Opcional', 'sm:col-span-4'],
  ['bairro', 'Bairro *', 'Ex.: Centro', 'sm:col-span-3'],
  ['cidade', 'Cidade', 'Se vazio: Breves', 'sm:col-span-2'],
  ['uf', 'UF', 'PA', 'sm:col-span-1'],
]

// Diz se o token do Melhor Envio está na Vercel (o token em si nunca vem ao navegador).
function StatusMelhorEnvio() {
  const [st, setSt] = useState(null)
  useEffect(() => {
    fetch('/api/frete')
      .then((r) => r.json())
      .then((j) => setSt(j.ok ? j : { erro: true }))
      .catch(() => setSt({ erro: true }))
  }, [])
  if (!st) return <p className="text-sm text-navy-500">Verificando o Melhor Envio…</p>
  if (st.erro) return <p className="text-sm text-navy-500">Não foi possível verificar o Melhor Envio agora (só funciona no site publicado).</p>
  return st.configurado ? (
    <p className="text-sm font-semibold text-emerald-700">
      ✓ Melhor Envio conectado{st.sandbox ? ' (modo de testes — sandbox)' : ''}. O frete é calculado no carrinho e no checkout.
    </p>
  ) : (
    <p className="text-sm font-semibold text-amber-700">
      Falta o token do Melhor Envio: crie em melhorenvio.com.br e coloque na Vercel como MELHOR_ENVIO_TOKEN. Até lá, o frete
      para fora de Breves continua sendo calculado depois da compra.
    </p>
  )
}

export default function SettingsAdmin() {
  const { settings, updateSettings, exportData, importData, resetData, supabaseAtivo, migrarParaSupabase } = useStore()
  const [form, setForm] = useState(settings)
  const [salvo, setSalvo] = useState(false)
  const [migrando, setMigrando] = useState(false)
  const [migrado, setMigrado] = useState(false)
  const fileRef = useRef(null)

  const migrar = async () => {
    setMigrando(true)
    const r = await migrarParaSupabase()
    setMigrando(false)
    if (r?.ok) {
      setMigrado(true)
      setTimeout(() => setMigrado(false), 2500)
    } else {
      alert('Não consegui enviar ao Supabase. Confira se você está logado como admin.')
    }
  }

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const salvar = (e) => {
    e.preventDefault()
    updateSettings(form)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 1800)
  }

  const exportar = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apham-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importar = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (importData(data)) {
          alert('Dados importados com sucesso! A página será recarregada.')
          window.location.reload()
        } else {
          alert('Arquivo inválido.')
        }
      } catch {
        alert('Não consegui ler o arquivo. Verifique se é um backup válido.')
      }
    }
    reader.readAsText(file)
  }

  const restaurar = () => {
    if (window.confirm('Isto apaga produtos, pedidos e novidades e volta tudo ao exemplo inicial. Continuar?')) {
      resetData()
      window.location.reload()
    }
  }

  return (
    <div>
      <PageTitle title="Configurações" subtitle="Dados da loja, pagamento e backup" />

      <form onSubmit={salvar} className="space-y-6">
        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Topo do site (hero)</h2>
          <p className="mb-4 text-sm text-navy-500">Os textos grandes da primeira dobra do site.</p>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Texto pequeno (em cima)" hint='Ex.: "Mais que uma Associação..."'>
              <input value={form.heroTagline ?? ''} onChange={(e) => set('heroTagline', e.target.value)} placeholder="Mais que uma Associação..." className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Título — parte branca" hint='Ex.: "Muito mais que"'>
                <input value={form.heroTitulo ?? ''} onChange={(e) => set('heroTitulo', e.target.value)} placeholder="Muito mais que" className={inputCls} />
              </Field>
              <Field label="Palavra em destaque (ciano)" hint='Ex.: "handebol"'>
                <input value={form.heroDestaque ?? ''} onChange={(e) => set('heroDestaque', e.target.value)} placeholder="handebol" className={inputCls} />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Contato e redes sociais</h2>
          <p className="mb-4 text-sm text-navy-500">Aparecem no rodapé, no menu e na página "Fale Conosco".</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Telefone"><input value={form.telefone ?? ''} onChange={(e) => set('telefone', e.target.value)} placeholder="(91) 99178-9031" className={inputCls} /></Field>
            <Field label="E-mail de contato"><input value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="apham.cvmf@gmail.com" className={inputCls} /></Field>
            <div className="sm:col-span-2">
              <Field label="Endereço"><input value={form.endereco ?? ''} onChange={(e) => set('endereco', e.target.value)} placeholder="Rua Justo Chermont, Centro — Breves/PA" className={inputCls} /></Field>
            </div>
            <Field label="Instagram (link)"><input value={form.instagram ?? ''} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." className={inputCls} /></Field>
            <Field label="Facebook (link)"><input value={form.facebook ?? ''} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/..." className={inputCls} /></Field>
            <Field label="YouTube (link do canal)"><input value={form.youtube ?? ''} onChange={(e) => set('youtube', e.target.value)} placeholder="https://youtube.com/@..." className={inputCls} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-navy-900">Loja</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome da loja"><input value={form.nomeLoja} onChange={(e) => set('nomeLoja', e.target.value)} className={inputCls} /></Field>
            <Field label="WhatsApp (só números, com DDI)" hint="Ex.: 5591991789031"><input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputCls} /></Field>
            <div className="sm:col-span-2">
              <Field label="Descrição da loja"><textarea rows={2} value={form.descricao} onChange={(e) => set('descricao', e.target.value)} className={`${inputCls} resize-none`} /></Field>
            </div>
            <Field label="Informação de entrega"><input value={form.entregaInfo} onChange={(e) => set('entregaInfo', e.target.value)} className={inputCls} /></Field>
            <Field label="Taxa de entrega (R$)" hint="0 = grátis / a combinar">
              <input type="number" min="0" step="0.01" value={form.entregaTaxa ?? 0} onChange={(e) => set('entregaTaxa', e.target.value === '' ? 0 : Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Frete grátis acima de (R$)" hint="Deixe vazio para não oferecer">
              <input type="number" min="0" step="0.01" value={form.entregaGratisAcima ?? ''} onChange={(e) => set('entregaGratisAcima', e.target.value === '' ? null : Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.lojaAtiva !== false} onChange={(e) => set('lojaAtiva', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
            Loja aberta para pedidos
          </label>
        </Card>

        <Card>
          <h2 className="mb-1 inline-flex items-center gap-2 font-display font-bold text-navy-900">
            <Truck className="h-5 w-5 text-cyan-600" />
            Frete pelos Correios (Melhor Envio)
          </h2>
          <p className="mb-3 text-sm text-navy-500">
            Para fora de Breves, o cliente vê o frete e o prazo pelo CEP e já paga junto com o pedido. Depois, a APHAM compra a
            etiqueta no Melhor Envio e posta nos Correios.
          </p>
          <StatusMelhorEnvio />
          <TesteFrete />
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.freteAutomatico !== false} onChange={(e) => set('freteAutomatico', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
            Calcular o frete automaticamente
          </label>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="CEP de onde os pacotes saem" hint="Onde a APHAM posta (Breves).">
              <input inputMode="numeric" value={form.freteCepOrigem ?? ''} onChange={(e) => set('freteCepOrigem', formatarCep(e.target.value))} placeholder="68800-000" className={inputCls} />
            </Field>
            <Field label="Dias para separar e postar" hint="Somados ao prazo dos Correios.">
              <input type="number" min="0" step="1" value={form.fretePrazoExtra ?? 2} onChange={(e) => set('fretePrazoExtra', e.target.value === '' ? 0 : Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Taxa de embalagem (R$)" hint="Somada a cada frete (0 = nada).">
              <input type="number" min="0" step="0.01" value={form.freteAdicional ?? 0} onChange={(e) => set('freteAdicional', e.target.value === '' ? 0 : Number(e.target.value))} className={inputCls} />
            </Field>
          </div>
          <p className="mb-2 mt-5 text-sm font-semibold text-navy-800">Embalagem padrão</p>
          <p className="mb-3 text-xs text-navy-400">Usada nos produtos sem peso e medidas no cadastro. Ex.: camiseta dobrada num envelope.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MEDIDAS_PACOTE.map(([k, rotulo, passo]) => (
              <Field key={k} label={rotulo}>
                <input
                  type="number"
                  min="0"
                  step={passo}
                  value={form.fretePacote?.[k] ?? PACOTE_PADRAO[k]}
                  onChange={(e) => set('fretePacote', { ...PACOTE_PADRAO, ...(form.fretePacote || {}), [k]: e.target.value === '' ? '' : Number(e.target.value) })}
                  className={inputCls}
                />
              </Field>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.freteSoCorreios !== false} onChange={(e) => set('freteSoCorreios', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
            Mostrar só os Correios (outras transportadoras quase não atendem o Marajó)
          </label>
          <label className="mt-3 flex items-start gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.freteSeguro === true} onChange={(e) => set('freteSeguro', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-cyan-500" />
            <span>
              Declarar o valor dos produtos (seguro)
              <span className="block text-xs font-normal text-navy-400">
                Desmarcado, o frete fica mais barato, igual à cotação padrão do Melhor Envio. Marcado, os Correios cobram um adicional e indenizam o valor declarado em caso de extravio.
              </span>
            </span>
          </label>

          <p className="mb-1 mt-6 text-sm font-semibold text-navy-800">Remetente das etiquetas</p>
          <p className="mb-3 text-xs text-navy-400">Vai impresso em todas as etiquetas geradas pelo painel (Pedidos → Como enviar). Preencha uma vez: os campos com * são obrigatórios.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            {CAMPOS_REMETENTE.map(([k, rotulo, ph, col]) => (
              <div key={k} className={col}>
                <Field label={rotulo}>
                  <input
                    value={form.remetente?.[k] ?? ''}
                    onChange={(e) => set('remetente', { ...(form.remetente || {}), [k]: k === 'cep' ? formatarCep(e.target.value) : k === 'uf' ? e.target.value.toUpperCase().slice(0, 2) : e.target.value })}
                    placeholder={ph}
                    className={inputCls}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-navy-900">Transmissão ao vivo</h2>
          <p className="mb-4 text-sm text-navy-500">
            Vai transmitir um jogo? Cole o link do YouTube da transmissão e marque a opção abaixo —
            o site mostra o jogo ao vivo na página inicial. Quando acabar, é só desmarcar.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Link do YouTube da transmissão" hint="Cole o link do vídeo/live (ex.: https://youtu.be/XXXXXXXXXXX ou youtube.com/live/XXXXXXXXXXX)">
                <input value={form.aoVivoUrl || ''} onChange={(e) => set('aoVivoUrl', e.target.value)} placeholder="https://..." className={inputCls} />
              </Field>
            </div>
            <Field label="Título da transmissão" hint="Ex.: APHAM x Adversário — final do campeonato">
              <input value={form.aoVivoTitulo || ''} onChange={(e) => set('aoVivoTitulo', e.target.value)} className={inputCls} />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.aoVivoAtivo === true} onChange={(e) => set('aoVivoAtivo', e.target.checked)} className="h-4 w-4 rounded border-navy-300 text-cyan-500" />
            Mostrar a transmissão ao vivo no site agora
          </label>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-navy-900">Pagamento via PIX</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Chave PIX" hint="Em branco: usa o CNPJ da APHAM (a mesma chave Pix das doações)."><input value={form.pixChave} onChange={(e) => set('pixChave', e.target.value)} className={inputCls} /></Field>
            <Field label="Nome do recebedor" hint="Máx. 25 caracteres, sem acento"><input value={form.pixNome} onChange={(e) => set('pixNome', e.target.value)} className={inputCls} /></Field>
            <Field label="Cidade (PIX)" hint="Como no cadastro da chave"><input value={form.pixCidade || ''} onChange={(e) => set('pixCidade', e.target.value)} className={inputCls} /></Field>
          </div>
        </Card>


        <div className="flex items-center gap-3">
          <button type="submit" className={btnPrimary}>
            {salvo ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {salvo ? 'Salvo!' : 'Salvar configurações'}
          </button>
        </div>
      </form>

      <Card className="mt-8">
        <div className="flex items-center gap-2">
          <Database className={`h-5 w-5 ${supabaseAtivo ? 'text-emerald-600' : 'text-navy-400'}`} />
          <h2 className="font-display font-bold text-navy-900">Banco de dados (Supabase)</h2>
        </div>
        <p className="mt-2 text-sm text-navy-500">
          {supabaseAtivo
            ? 'Conectado. Os dados do painel são salvos no banco e aparecem em qualquer dispositivo. Use o botão abaixo para reenviar os dados atuais ao banco, se precisar.'
            : 'Ainda não conectado (rodando só neste navegador). As variáveis do Supabase são configuradas no deploy.'}
        </p>
        {supabaseAtivo && (
          <button type="button" onClick={migrar} disabled={migrando} className={`${btnGhost} mt-4`}>
            {migrado ? <Check className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
            {migrando ? 'Enviando...' : migrado ? 'Enviado!' : 'Enviar dados ao Supabase'}
          </button>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="mb-1 font-display font-bold text-navy-900">Backup dos dados</h2>
        <p className="mb-4 text-sm text-navy-500">
          Os dados ficam salvos neste navegador. Exporte um backup de vez em quando (e antes de trocar
          de computador). Quando ligarmos o banco de dados, importamos esse arquivo.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={exportar} className={btnGhost}><Download className="h-4 w-4" />Exportar backup</button>
          <button type="button" onClick={() => fileRef.current?.click()} className={btnGhost}><Upload className="h-4 w-4" />Importar backup</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => importar(e.target.files?.[0])} />
          <button type="button" onClick={restaurar} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            <RotateCcw className="h-4 w-4" />Restaurar exemplo
          </button>
        </div>
      </Card>
    </div>
  )
}
