import { useRef, useState } from 'react'
import { Save, Download, Upload, RotateCcw, Check } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { PageTitle, Card, Field, inputCls, btnPrimary, btnGhost } from './ui'

export default function SettingsAdmin() {
  const { settings, updateSettings, exportData, importData, resetData } = useStore()
  const [form, setForm] = useState(settings)
  const [salvo, setSalvo] = useState(false)
  const fileRef = useRef(null)

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
          <h2 className="mb-4 font-display font-bold text-navy-900">Loja</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome da loja"><input value={form.nomeLoja} onChange={(e) => set('nomeLoja', e.target.value)} className={inputCls} /></Field>
            <Field label="WhatsApp (só números, com DDI)" hint="Ex.: 5591992446806"><input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputCls} /></Field>
            <div className="sm:col-span-2">
              <Field label="Descrição da loja"><textarea rows={2} value={form.descricao} onChange={(e) => set('descricao', e.target.value)} className={`${inputCls} resize-none`} /></Field>
            </div>
            <Field label="E-mail"><input value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} /></Field>
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
          <h2 className="mb-4 font-display font-bold text-navy-900">Pagamento via PIX</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Chave PIX" hint="Deixe em branco para não oferecer PIX."><input value={form.pixChave} onChange={(e) => set('pixChave', e.target.value)} className={inputCls} /></Field>
            <Field label="Nome do recebedor" hint="Máx. 25 caracteres, sem acento"><input value={form.pixNome} onChange={(e) => set('pixNome', e.target.value)} className={inputCls} /></Field>
            <Field label="Cidade (PIX)" hint="Como no cadastro da chave"><input value={form.pixCidade || ''} onChange={(e) => set('pixCidade', e.target.value)} className={inputCls} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-navy-900">Segurança</h2>
          <Field label="Senha do painel" hint="Troque a senha padrão. (Proteção simples do lado do navegador — a segurança real virá com o login do servidor na próxima fase.)">
            <input value={form.senhaAdmin} onChange={(e) => set('senhaAdmin', e.target.value)} className={inputCls} />
          </Field>
        </Card>

        <div className="flex items-center gap-3">
          <button type="submit" className={btnPrimary}>
            {salvo ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {salvo ? 'Salvo!' : 'Salvar configurações'}
          </button>
        </div>
      </form>

      <Card className="mt-8">
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
