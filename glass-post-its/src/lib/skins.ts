export interface Skin {
  id: string;
  name: string;
  description: string;
  // CSS custom properties
  bgTint: string;
  borderColor: string;
  glowColor: string;
  reflectionOpacity: number;
  textColor: string;
  textSecondary: string;
  accentColor: string;
  surfaceOverlay: string;
  // Preview colors for skin picker dropdown
  previewBg: string;
  previewBorder: string;
}

export const SKINS: Record<string, Skin> = {
  glass: {
    id: 'glass',
    name: 'Glass',
    description: 'Clean frosted glass',
    bgTint: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    glowColor: 'rgba(255, 255, 255, 0.05)',
    reflectionOpacity: 0.08,
    textColor: 'rgba(255, 255, 255, 0.92)',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    accentColor: 'rgba(140, 190, 255, 0.9)',
    surfaceOverlay: 'transparent',
    previewBg: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(180,180,200,0.08))',
    previewBorder: 'rgba(255, 255, 255, 0.3)',
  },
  ice: {
    id: 'ice',
    name: 'Ice Cube',
    description: 'Frozen crystal with frost',
    bgTint: 'rgba(140, 200, 255, 0.06)',
    borderColor: 'rgba(140, 210, 255, 0.25)',
    glowColor: 'rgba(100, 180, 255, 0.1)',
    reflectionOpacity: 0.12,
    textColor: 'rgba(220, 240, 255, 0.95)',
    textSecondary: 'rgba(160, 200, 230, 0.6)',
    accentColor: 'rgba(100, 200, 255, 0.9)',
    surfaceOverlay: 'transparent',
    previewBg: 'linear-gradient(135deg, rgba(160,220,255,0.4), rgba(80,150,220,0.2), rgba(200,240,255,0.3))',
    previewBorder: 'rgba(160, 225, 255, 0.5)',
  },
  magma: {
    id: 'magma',
    name: 'Magma',
    description: 'Volcanic rock with lava cracks',
    bgTint: 'rgba(200, 50, 20, 0.06)',
    borderColor: 'rgba(255, 100, 50, 0.25)',
    glowColor: 'rgba(255, 80, 30, 0.12)',
    reflectionOpacity: 0.06,
    textColor: 'rgba(255, 230, 220, 0.95)',
    textSecondary: 'rgba(255, 180, 150, 0.6)',
    accentColor: 'rgba(255, 150, 80, 0.9)',
    surfaceOverlay: 'transparent',
    previewBg: 'linear-gradient(135deg, rgba(60,15,5,0.9), rgba(255,80,15,0.4), rgba(40,10,2,0.8), rgba(255,100,20,0.3))',
    previewBorder: 'rgba(255, 100, 30, 0.6)',
  },
  sun: {
    id: 'sun',
    name: 'Sun',
    description: 'Golden solar radiance',
    bgTint: 'rgba(255, 200, 50, 0.05)',
    borderColor: 'rgba(255, 210, 80, 0.25)',
    glowColor: 'rgba(255, 200, 50, 0.1)',
    reflectionOpacity: 0.1,
    textColor: 'rgba(255, 250, 230, 0.95)',
    textSecondary: 'rgba(255, 220, 150, 0.6)',
    accentColor: 'rgba(255, 200, 80, 0.9)',
    surfaceOverlay: 'transparent',
    previewBg: 'radial-gradient(circle at 30% 30%, rgba(255,240,150,0.5), rgba(255,200,50,0.3), rgba(200,150,20,0.2))',
    previewBorder: 'rgba(255, 215, 80, 0.5)',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    description: 'Warm citrus amber',
    bgTint: 'rgba(255, 140, 50, 0.05)',
    borderColor: 'rgba(255, 160, 80, 0.25)',
    glowColor: 'rgba(255, 140, 50, 0.1)',
    reflectionOpacity: 0.08,
    textColor: 'rgba(255, 245, 235, 0.95)',
    textSecondary: 'rgba(255, 190, 140, 0.6)',
    accentColor: 'rgba(255, 170, 80, 0.9)',
    surfaceOverlay: 'transparent',
    previewBg: 'linear-gradient(135deg, rgba(255,170,60,0.4), rgba(255,130,30,0.2), rgba(255,160,50,0.3))',
    previewBorder: 'rgba(255, 165, 70, 0.5)',
  },
};

export const SKIN_LIST = Object.values(SKINS);
