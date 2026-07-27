// Platform Rules & Character Limits Data
// Easily explainable for college lab submission

export const PLATFORMS = {
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    color: '#1DA1F2',
    charLimit: 280,
    requiresImage: false,
    description: 'Max 280 characters.',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    charLimit: 3000,
    requiresImage: false,
    description: 'Max 3000 characters. Professional posts.',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    charLimit: 2200,
    requiresImage: true, // Requires an image attachment
    description: 'Max 2200 characters. Must include an image.',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    charLimit: 63206,
    requiresImage: false,
    description: 'Max 63206 characters. Flexible post format.',
  },
};
