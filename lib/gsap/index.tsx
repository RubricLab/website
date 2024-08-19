'use client'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import TextPlugin from 'gsap/dist/TextPlugin'

export function GsapSetup() {
  if (typeof window !== 'undefined') gsap.registerPlugin(TextPlugin, useGSAP)

  return null
}
