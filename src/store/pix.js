import QRCode from 'qrcode'

// ============================================================================
//  PIX — gera o código "copia e cola" (BR Code / EMV) e o QR Code, tudo no
//  navegador. Não exige gateway nem conta: basta a chave PIX da APHAM.
//  Obs.: pagamento com cartão/gateway é outra fase (precisa de credenciais).
// ============================================================================

function limpar(txt, max) {
  return (txt || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .trim()
    .slice(0, max)
}

// Campo EMV: id + tamanho(2 dígitos) + valor
function emv(id, valor) {
  const len = valor.length.toString().padStart(2, '0')
  return `${id}${len}${valor}`
}

function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function gerarPixPayload({ chave, nome, cidade, valor, txid = '***' }) {
  if (!chave) return ''
  const gui = emv('00', 'BR.GOV.BCB.PIX')
  const key = emv('01', chave.toString().trim())
  const maic = emv('26', gui + key)
  const valorStr = valor != null && Number(valor) > 0 ? Number(valor).toFixed(2) : ''
  const adicional = emv('62', emv('05', limpar(txid, 25) || '***'))
  const partes = [
    emv('00', '01'),
    maic,
    emv('52', '0000'),
    emv('53', '986'),
    valorStr ? emv('54', valorStr) : '',
    emv('58', 'BR'),
    emv('59', limpar(nome, 25) || 'RECEBEDOR'),
    emv('60', limpar(cidade, 15) || 'BREVES'),
    adicional,
  ].join('')
  const semCrc = partes + '6304'
  return semCrc + crc16(semCrc)
}

export async function pixQrDataUrl(payload) {
  if (!payload) return ''
  try {
    return await QRCode.toDataURL(payload, { margin: 1, width: 320, errorCorrectionLevel: 'M' })
  } catch {
    return ''
  }
}
