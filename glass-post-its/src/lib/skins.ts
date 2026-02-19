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
  // Optional texture (CSS background-image)
  texture?: string;
  // Gradient for the surface
  gradient?: string;
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
  },
  ice: {
    id: 'ice',
    name: 'Ice Cube',
    description: 'Frozen crystal blue',
    bgTint: 'rgba(140, 200, 255, 0.06)',
    borderColor: 'rgba(140, 210, 255, 0.25)',
    glowColor: 'rgba(100, 180, 255, 0.1)',
    reflectionOpacity: 0.12,
    textColor: 'rgba(220, 240, 255, 0.95)',
    textSecondary: 'rgba(160, 200, 230, 0.6)',
    accentColor: 'rgba(100, 200, 255, 0.9)',
    surfaceOverlay: 'linear-gradient(135deg, rgba(180, 220, 255, 0.04) 0%, rgba(100, 160, 220, 0.02) 50%, rgba(200, 230, 255, 0.05) 100%)',
    texture: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L25 5 L15 20 Z' fill='rgba(200,230,255,0.03)' /%3E%3Cpath d='M40 30 L55 25 L45 45 Z' fill='rgba(180,220,255,0.02)' /%3E%3Cpath d='M5 40 L20 50 L8 55 Z' fill='rgba(200,240,255,0.025)' /%3E%3C/svg%3E")`,
    gradient: 'linear-gradient(180deg, rgba(160, 210, 255, 0.06) 0%, rgba(100, 170, 230, 0.02) 50%, rgba(140, 200, 255, 0.04) 100%)',
  },
  magma: {
    id: 'magma',
    name: 'Magma',
    description: 'Lava with glowing cracks',
    bgTint: 'rgba(200, 50, 20, 0.06)',
    borderColor: 'rgba(255, 100, 50, 0.25)',
    glowColor: 'rgba(255, 80, 30, 0.12)',
    reflectionOpacity: 0.06,
    textColor: 'rgba(255, 230, 220, 0.95)',
    textSecondary: 'rgba(255, 180, 150, 0.6)',
    accentColor: 'rgba(255, 150, 80, 0.9)',
    surfaceOverlay: 'linear-gradient(135deg, rgba(255, 80, 20, 0.04) 0%, rgba(200, 30, 10, 0.02) 50%, rgba(255, 120, 40, 0.05) 100%)',
    texture: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 20 Q20 15 30 25 Q35 30 25 40 Q15 35 10 28 Z' fill='none' stroke='rgba(255,100,30,0.04)' stroke-width='1'/%3E%3Cpath d='M50 10 Q60 20 55 35 Q50 45 40 30 Z' fill='none' stroke='rgba(255,80,20,0.03)' stroke-width='1'/%3E%3Cpath d='M20 55 Q35 50 45 60 Q50 70 35 72 Q25 68 20 60 Z' fill='none' stroke='rgba(255,120,40,0.035)' stroke-width='1'/%3E%3C/svg%3E")`,
    gradient: 'linear-gradient(180deg, rgba(255, 80, 20, 0.05) 0%, rgba(150, 20, 0, 0.03) 60%, rgba(255, 60, 10, 0.06) 100%)',
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
    surfaceOverlay: 'radial-gradient(ellipse at 30% 20%, rgba(255, 220, 80, 0.06) 0%, transparent 60%)',
    gradient: 'linear-gradient(180deg, rgba(255, 220, 80, 0.06) 0%, rgba(255, 180, 40, 0.02) 50%, rgba(255, 200, 60, 0.04) 100%)',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    description: 'Warm citrus sunset',
    bgTint: 'rgba(255, 140, 50, 0.05)',
    borderColor: 'rgba(255, 160, 80, 0.25)',
    glowColor: 'rgba(255, 140, 50, 0.1)',
    reflectionOpacity: 0.08,
    textColor: 'rgba(255, 245, 235, 0.95)',
    textSecondary: 'rgba(255, 190, 140, 0.6)',
    accentColor: 'rgba(255, 170, 80, 0.9)',
    surfaceOverlay: 'linear-gradient(135deg, rgba(255, 160, 60, 0.04) 0%, rgba(255, 120, 30, 0.02) 50%, rgba(255, 180, 80, 0.05) 100%)',
    gradient: 'linear-gradient(180deg, rgba(255, 160, 60, 0.06) 0%, rgba(255, 120, 30, 0.02) 50%, rgba(255, 140, 50, 0.04) 100%)',
  },
};

export const SKIN_LIST = Object.values(SKINS);
