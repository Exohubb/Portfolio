'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils/cn'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)
  const objRef = useRef({ value: 0 })

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true
      objRef.current.value = 0
      gsap.to(objRef.current, {
        value: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => setCount(Math.round(objRef.current.value)),
      })
    }
  }, [inView, target, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
