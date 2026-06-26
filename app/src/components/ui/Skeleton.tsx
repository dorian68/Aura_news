'use client'
import React from 'react'
import { cn } from '@/lib/cn'

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn('al-shimmer', className)} style={style} />
}
