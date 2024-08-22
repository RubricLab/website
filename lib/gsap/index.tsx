'use client'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import DrawSVGPlugin from 'gsap/dist/DrawSVGPlugin'
import SplitText from 'gsap/dist/SplitText'
import TextPlugin from 'gsap/dist/TextPlugin'

export function GsapSetup() {
  if (typeof window !== 'undefined')
    gsap.registerPlugin(TextPlugin, DrawSVGPlugin, SplitText, useGSAP)

  return null
}
