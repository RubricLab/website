import { fragmentOn } from "basehub";
import { buttonFragment, optimizedImageFragment, videoFragment } from "../fragments";

export const labProjectFragment = fragmentOn('LabProjectsItem', {
  _id: true,
  _title: true,
  _slug: true,
  description: true,
  qa: {
    items: {
      _id: true,
      question: true,
      answer: true
    }
  },
  footerMedia: {
    on_ImageComponent: {
      image: optimizedImageFragment
    },
    on_VideoComponent: {
      video: videoFragment
    }
  },
  ctas: {
    items: buttonFragment
  }
})

export type LabProjectFragment = fragmentOn.infer<typeof labProjectFragment>
