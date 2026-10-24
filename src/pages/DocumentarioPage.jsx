import FolderPage from '../components/FolderPage'
import Capitulos from '../components/Capitulos'
import { documentarioFolder } from '../data/folders'

export default function DocumentarioPage() {
  return <FolderPage dados={documentarioFolder} extra={<Capitulos />} />
}
