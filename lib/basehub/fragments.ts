import { fragmentOn } from "basehub";

/* -------------------------------------------------------------------------- */
/*                                   Avatar                                   */
/* -------------------------------------------------------------------------- */

export const avatarFragment = fragmentOn("BlockImage", {
  url: {
    __args: {
      quality: 100,
      width: 100,
      height: 100,
    },
  },
  alt: true,
});

export type AvatarFragment = fragmentOn.infer<typeof avatarFragment>;

/* -------------------------------------------------------------------------- */
/*                                   Author                                   */
/* -------------------------------------------------------------------------- */

export const authorFragment = fragmentOn("AuthorComponent", {
  _id: true,
  _title: true,
  image: { ...avatarFragment, height: true, width: true },
});

export type AuthorFragment = fragmentOn.infer<typeof authorFragment>;

/* -------------------------------------------------------------------------- */
/*                                    Image                                   */
/* -------------------------------------------------------------------------- */

export const optimizedImageFragment = fragmentOn("BlockImage", {
  url: {
    __args: {
      quality: 100,
      format: "auto",
    },
  },
  blurDataURL: true,
  aspectRatio: true,
  width: true,
  height: true,
  alt: true,
});

export type OptimizedImageFragment = fragmentOn.infer<typeof optimizedImageFragment>;

/* -------------------------------------------------------------------------- */
/*                                    Video                                   */
/* -------------------------------------------------------------------------- */

export const videoFragment = fragmentOn('BlockVideo', {
  url: true,
  width: true,
  height: true
})

/* -------------------------------------------------------------------------- */
/*                                   Button                                   */
/* -------------------------------------------------------------------------- */

export const buttonFragment = fragmentOn("ButtonComponent", {
  label: true,
  href: true,
  type: true,
});

/* -------------------------------------------------------------------------- */
/*                              Dark Light Image                              */
/* -------------------------------------------------------------------------- */

export const darkLightImageFragment = fragmentOn("DarkLightImageComponent", {
  dark: optimizedImageFragment,
  light: optimizedImageFragment,
});

export type DarkLightImageFragment = fragmentOn.infer<typeof darkLightImageFragment>;
