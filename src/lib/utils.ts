import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categories = [
  { id: 'tracks', label: '🎵 Треки', description: 'Загрузи свои треки и узнай, что думают другие.' },
  { id: 'works', label: '🎨 Работы', description: 'Покажи св��и работы, получи честную оценку и узнай мнение сообщества.' },
  { id: 'outfits', label: '👕 Образы', description: 'Покажи свой аутфит и посмотри, что думают о нём другие.' },
  { id: 'appearance', label: '😎 Внешность', description: 'Выложи свою внешность и узнай мнение других людей.' },
  { id: 'photos', label: '📸 Фото', description: 'Покажи навыки фотографа — загрузи свои самые эстетичные и красивые фото.' },
  { id: 'ideas', label: '💡 Идеи', description: 'Поделись своей идеей и узнай, как её оценивают другие.' },
] as const

export const getRatingEmoji = (rating: number) => {
  if (rating <= 30) return '👎'
  if (rating <= 60) return '😐'
  if (rating <= 80) return '👌'
  return '🔥'
}

export const getReactionEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    heart: '❤️',
    fire: '🔥',
    laugh: '😂',
    thumbs_up: '👍',
    thumbs_down: '👎',
  }
  return emojis[type] || type
}

export const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
  }
  if (days > 0) return `${days}д назад`
  if (hours > 0) return `${hours}ч назад`
  if (minutes > 0) return `${minutes}м назад`
  return 'только что'
}
