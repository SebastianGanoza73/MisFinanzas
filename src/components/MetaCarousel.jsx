import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MetaCard from './MetaCard'

const AUTOPLAY_MS = 5000

// Carrusel tipo "promos de Yape": avanza solo cada 5s, pero en cuanto el
// usuario desliza o toca un punto, se detiene esos 5s antes de retomar el
// autoplay, para no pelearse con la interacción manual.
export default function MetaCarousel({ metas }) {
  const [index, setIndex] = useState(0)
  const autoplayRef = useRef(null)
  const resumeRef = useRef(null)
  const touchStartX = useRef(null)

  const total = metas.length

  const clearTimers = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    if (resumeRef.current) clearTimeout(resumeRef.current)
  }

  const startAutoplay = useCallback(() => {
    if (total <= 1) return
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, AUTOPLAY_MS)
  }, [total])

  useEffect(() => {
    startAutoplay()
    return clearTimers
  }, [startAutoplay])

  // Si se elimina una meta y el índice actual queda fuera de rango.
  useEffect(() => {
    if (index >= total && total > 0) setIndex(0)
  }, [total, index])

  // Cada vez que hay interacción manual: pausa el autoplay actual y lo
  // reprograma para que retome recién 5s después de la última interacción.
  const pauseThenResume = useCallback(() => {
    clearTimers()
    resumeRef.current = setTimeout(startAutoplay, AUTOPLAY_MS)
  }, [startAutoplay])

  const goTo = (i) => {
    setIndex(i)
    if (total > 1) pauseThenResume()
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(delta) < 40) return
    if (delta < 0) goTo((index + 1) % total)
    else goTo((index - 1 + total) % total)
  }

  if (total === 0) {
    return (
      <Link
        to="/metas-ahorro"
        className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
      >
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Aún no tienes metas de ahorro. Crea la primera →
        </span>
      </Link>
    )
  }

  return (
    <div>
      <div
        className="overflow-hidden -mx-1 px-1"
        onTouchStart={total > 1 ? handleTouchStart : undefined}
        onTouchEnd={total > 1 ? handleTouchEnd : undefined}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {metas.map((m) => (
            <div key={m.id} className="carousel-slide px-1">
              <MetaCard meta={m} compact />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {metas.map((m, i) => (
            <button
              key={m.id}
              onClick={() => goTo(i)}
              aria-label={`Ver meta ${m.nombre}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-5 bg-brand-600 dark:bg-brand-400'
                  : 'w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
