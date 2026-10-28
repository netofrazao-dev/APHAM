import FolderPage from '../components/FolderPage'
import PainelDoacoes from '../components/PainelDoacoes'
import { incentivoFolder } from '../data/folders'

export default function IncentivoPage() {
  return <FolderPage dados={incentivoFolder} extra={<PainelDoacoes meta={incentivoFolder.metaCaptacao} />} />
}
