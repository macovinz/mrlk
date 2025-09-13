import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  className?: string      // Optional: Tailwind overrides
  containerClass?: string // Optional: Extra control on inner container
}

export default function Section({
  children,
  className,
  containerClass,
}: SectionProps) {
  return (
    <section className={clsx('py-12 w-full', className)}>
  <div className={clsx('container', containerClass)}>
    {children}
  </div>
</section>

  )
}
