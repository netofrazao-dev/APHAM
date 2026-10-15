import {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  HandHeart,
  HandCoins,
  Handshake,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Users,
} from 'lucide-react'

// Resolve ícones a partir do nome usado no arquivo de conteúdo.
const map = {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  HandHeart,
  HandCoins,
  Handshake,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
}

export default function Icon({ name, ...props }) {
  const Cmp = map[name] || Users
  return <Cmp {...props} />
}
