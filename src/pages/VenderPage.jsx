import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck, CheckCircle2, ClipboardList, Mail, Package, Store, Wallet } from 'lucide-react'
import PageShell from '../components/PageShell'
import Reveal from '../components/Reveal'
import { useStore } from '../store/StoreContext'
import { formatBRL } from '../store/format'
import { arred } from '../store/lojas'

// Página para lojistas pedirem para vender dentro da loja da APHAM.
const vazio = {
  nome: '',
  responsavel: '',
  whatsapp: '',
  cidade: '',
  descricao: '',
  instagram: '',
  pixChave: '',
  pixTitular: '',
  email: '',
  senha: '',
  aceite: false,
}

const campo =
  'w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20'

function Campo({ label, dica, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>
      {children}
      {dica && <span className="mt-1 block text-xs text-navy-400">{dica}</span>}
    </label>
  )
}

export default function VenderPage() {
  const { comissao, marketplaceOk, solicitarLoja, minhaLoja } = useStore()
  const [f, setF] = useState(vazio)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [feito, setFeito] = useState(null) // { confirmarEmail }
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const exemplo = 100
  const passos = [
    { Icone: ClipboardList, titulo: 'Faça o cadastro', texto: 'Preencha os dados da sua loja e crie seu acesso.' },
    { Icone: BadgeCheck, titulo: 'A APHAM aprova', texto: 'Conferimos o cadastro e liberamos a sua lojinha.' },
    { Icone: Package, titulo: 'Cadastre seus produtos', texto: 'Você coloca fotos, preços e estoque pelo seu painel.' },
    { Icone: Wallet, titulo: 'Venda e receba', texto: 'O cliente paga a APHAM e a APHAM repassa o seu valor.' },
  ]

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')
    if (f.senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')
    if (!f.aceite) return setErro('Para continuar, aceite as condições da parceria.')
    setEnviando(true)
    const { email, senha, aceite, ...dados } = f
    const r = await solicitarLoja({ dados: { ...dados, nome: dados.nome.trim() }, email: email.trim(), senha })
    setEnviando(false)
    if (!r.ok) return setErro(r.erro || 'Não foi possível enviar o cadastro.')
    setFeito(r)
  }

  return (
    <PageShell
      eyebrow="Loja APHAM"
      titulo="Venda na loja da APHAM"
      descricao="Tenha a sua lojinha dentro da loja oficial da associação e alcance quem apoia o handebol do Marajó."
    >
      {/* Como funciona */}
      <section className="section-pad py-16 lg:py-20">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow flex justify-center">
              <span className="h-px w-6 bg-cyan-400" />
              Lojas parceiras
              <span className="h-px w-6 bg-cyan-400" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900">Como funciona</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((p, i) => (
              <Reveal key={p.titulo} delay={0.06 * i}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <p.Icone className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-cyan-700">Passo {i + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-navy-900">{p.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Exemplo da comissão */}
          <Reveal>
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-navy-950 p-6 text-center shadow-lift sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">A parte da APHAM</p>
              <p className="mt-3 text-white/80">
                Você define o preço que quer receber. Na loja, o produto aparece com esse valor{' '}
                <strong className="text-white">+ {comissao}%</strong> para a APHAM, que cuida da vitrine, do pagamento e do atendimento.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ['Você define', formatBRL(exemplo)],
                  ['O cliente paga', formatBRL(arred(exemplo * (1 + comissao / 100)))],
                  ['Você recebe', formatBRL(exemplo)],
                ].map(([r, v]) => (
                  <div key={r} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{r}</p>
                    <p className="mt-1 font-display text-2xl font-extrabold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cadastro */}
      <section id="cadastro" className="section-pad border-t border-navy-100 bg-white py-16 lg:py-20">
        <div className="container-x max-w-3xl">
          <Reveal className="text-center">
            <span className="eyebrow flex justify-center">
              <span className="h-px w-6 bg-cyan-400" />
              Cadastro
              <span className="h-px w-6 bg-cyan-400" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900">Quero vender na loja da APHAM</h2>
            <p className="mt-3 text-ink/70">
              Já tem cadastro?{' '}
              <Link to="/lojista" className="font-semibold text-cyan-700 hover:text-cyan-800">
                Entre na área do lojista
              </Link>
              .
            </p>
          </Reveal>

          {feito ? (
            <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              {feito.confirmarEmail ? <Mail className="mx-auto h-10 w-10 text-emerald-600" /> : <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />}
              <h3 className="mt-4 font-display text-2xl font-extrabold text-navy-900">Cadastro enviado!</h3>
              <p className="mx-auto mt-3 max-w-lg text-ink/75">
                {feito.confirmarEmail
                  ? 'Enviamos um e-mail para você confirmar o cadastro. Depois de confirmar, entre na área do lojista. A APHAM vai analisar o pedido da sua loja.'
                  : 'A APHAM vai analisar o pedido da sua loja. Você acompanha tudo pela área do lojista.'}
              </p>
              <Link to="/lojista" className="btn-primary mt-6">
                Área do lojista
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : minhaLoja ? (
            <div className="mt-10 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 text-center">
              <Store className="mx-auto h-8 w-8 text-cyan-600" />
              <p className="mt-3 font-semibold text-navy-900">Você já tem a loja “{minhaLoja.nome}”.</p>
              <Link to="/lojista" className="btn-primary mt-5">
                Ir para a área do lojista
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : !marketplaceOk ? (
            <div className="mt-10 rounded-2xl border border-dashed border-navy-200 p-8 text-center text-ink/70">
              O cadastro de lojas parceiras abre em breve.
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-10 space-y-8">
              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-3 font-display text-lg font-bold text-navy-900">Sua loja</legend>
                <Campo label="Nome da loja *">
                  <input required value={f.nome} onChange={set('nome')} className={campo} placeholder="Ex.: Ateliê Marajoara" />
                </Campo>
                <Campo label="Responsável *">
                  <input required value={f.responsavel} onChange={set('responsavel')} className={campo} placeholder="Seu nome completo" />
                </Campo>
                <Campo label="WhatsApp *">
                  <input required value={f.whatsapp} onChange={set('whatsapp')} className={campo} placeholder="(91) 90000-0000" />
                </Campo>
                <Campo label="Cidade">
                  <input value={f.cidade} onChange={set('cidade')} className={campo} placeholder="Breves — PA" />
                </Campo>
                <div className="sm:col-span-2">
                  <Campo label="O que você vende? *">
                    <textarea required rows={3} value={f.descricao} onChange={set('descricao')} className={`${campo} resize-y`} placeholder="Conte sobre a sua loja e os seus produtos." />
                  </Campo>
                </div>
                <Campo label="Instagram" dica="Opcional">
                  <input value={f.instagram} onChange={set('instagram')} className={campo} placeholder="@sualoja" />
                </Campo>
              </fieldset>

              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-3 font-display text-lg font-bold text-navy-900">Para receber os repasses</legend>
                <Campo label="Chave PIX *">
                  <input required value={f.pixChave} onChange={set('pixChave')} className={campo} placeholder="CPF, e-mail, telefone ou chave aleatória" />
                </Campo>
                <Campo label="Nome do titular do PIX *">
                  <input required value={f.pixTitular} onChange={set('pixTitular')} className={campo} />
                </Campo>
              </fieldset>

              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-3 font-display text-lg font-bold text-navy-900">Seu acesso</legend>
                <Campo label="E-mail *">
                  <input required type="email" value={f.email} onChange={set('email')} className={campo} placeholder="voce@email.com" />
                </Campo>
                <Campo label="Senha *" dica="Mínimo de 6 caracteres">
                  <input required type="password" value={f.senha} onChange={set('senha')} className={campo} />
                </Campo>
              </fieldset>

              <label className="flex items-start gap-3 rounded-xl bg-navy-50 p-4 text-sm text-ink/80">
                <input type="checkbox" checked={f.aceite} onChange={set('aceite')} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-cyan-500" />
                <span>
                  Concordo que os produtos aparecem na loja com o meu preço + {comissao}% para a APHAM, que o cliente paga a APHAM e que a APHAM me repassa o
                  meu valor pela chave PIX informada.
                </span>
              </label>

              {erro && <p className="text-sm font-semibold text-red-600">{erro}</p>}

              <div className="text-center">
                <button type="submit" disabled={enviando} className="btn-primary min-w-[14rem]">
                  {enviando ? 'Enviando...' : 'Enviar cadastro'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  )
}
