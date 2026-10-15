import { useEffect, useState } from 'react'
import { Copy, Check, QrCode } from 'lucide-react'
import { gerarPixPayload, pixQrDataUrl } from '../../store/pix'
import { formatBRL } from '../../store/format'

export default function PixBox({ chave, nome, cidade, valor, txid }) {
  const [qr, setQr] = useState('')
  const [copiado, setCopiado] = useState(false)
  const payload = gerarPixPayload({ chave, nome, cidade, valor, txid })

  useEffect(() => {
    let vivo = true
    pixQrDataUrl(payload).then((url) => vivo && setQr(url))
    return () => {
      vivo = false
    }
  }, [payload])

  if (!chave) return null

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(payload)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="w-full rounded-2xl border border-navy-100 bg-white p-5 text-left">
      <div className="flex items-center gap-2 text-navy-800">
        <QrCode className="h-5 w-5 text-cyan-600" />
        <p className="font-display font-bold">Pague com PIX — {formatBRL(valor)}</p>
      </div>
      <p className="mt-1 text-xs text-navy-500">{nome}</p>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {qr && <img src={qr} alt="QR Code PIX" className="h-44 w-44 rounded-lg border border-navy-100" />}
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">PIX copia e cola</p>
          <div className="rounded-lg bg-navy-50 p-3">
            <code className="block max-h-20 overflow-y-auto break-all text-xs text-navy-700">{payload}</code>
          </div>
          <button
            type="button"
            onClick={copiar}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-900"
          >
            {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiado ? 'Copiado!' : 'Copiar código PIX'}
          </button>
          <p className="mt-2 text-xs text-navy-400">
            Abra o app do seu banco, escolha PIX e escaneie o QR ou cole o código. Depois envie o
            comprovante no WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
