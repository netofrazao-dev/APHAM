import FolderPage from '../components/FolderPage'
import StoreTeaser from '../components/StoreTeaser'
import { cooperativaFolder } from '../data/folders'

export default function CooperativaPage() {
  return <FolderPage dados={cooperativaFolder} depois={<StoreTeaser />} />
}
