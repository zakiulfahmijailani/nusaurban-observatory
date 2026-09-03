import { useState, useCallback, useEffect } from 'react';

export type City = 'jakarta' | 'bandung';
export type Layer = 'lulc' | 'vegetation_change';

export interface MapState {
  activeCity: City;
  activeYear: number;
  activeLayer: Layer;
  rasterOpacity: number;
  showBoundary: boolean;
  isAnimating: boolean;
  animationSpeed: number;
  basemapStyle: string;
}

const defaultState: MapState = {
  activeCity: 'jakarta',
  activeYear: 2025,
  activeLayer: 'lulc',
  rasterOpacity: 0.85,
  showBoundary: true,
  isAnimating: false,
  animationSpeed: 1000,
  basemapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

export function useMapState(initialState: Partial<MapState> = {}) {
  const [state, setState] = useState<MapState>({ ...defaultState, ...initialState });

  const setActiveCity = useCallback((city: City) => {
    setState((prev) => ({ ...prev, activeCity: city }));
  }, []);

  const setActiveYear = useCallback((year: number) => {
    setState((prev) => ({ ...prev, activeYear: Math.max(2017, Math.min(2025, year)) }));
  }, []);

  const setActiveLayer = useCallback((layer: Layer) => {
    setState((prev) => ({ ...prev, activeLayer: layer }));
  }, []);

  const setRasterOpacity = useCallback((opacity: number) => {
    setState((prev) => ({ ...prev, rasterOpacity: Math.max(0, Math.min(1, opacity)) }));
  }, []);

  const setShowBoundary = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showBoundary: show }));
  }, []);

  const setIsAnimating = useCallback((isAnimating: boolean) => {
    setState((prev) => ({ ...prev, isAnimating }));
  }, []);

  const setAnimationSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, animationSpeed: speed }));
  }, []);

  const setBasemapStyle = useCallback((style: string) => {
    setState((prev) => ({ ...prev, basemapStyle: style }));
  }, []);

  const toggleAnimation = useCallback(() => {
    setState((prev) => ({ ...prev, isAnimating: !prev.isAnimating }));
  }, []);

  const nextYear = useCallback(() => {
    setState((prev) => {
      const next = prev.activeYear + 1;
      if (next > 2025) {
        return { ...prev, isAnimating: false }; // Stop at the end
      }
      return { ...prev, activeYear: next };
    });
  }, []);

  const prevYear = useCallback(() => {
    setState((prev) => {
      const next = prev.activeYear - 1;
      return { ...prev, activeYear: Math.max(2017, next) };
    });
  }, []);

  // Animation effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (state.isAnimating) {
      intervalId = setInterval(() => {
        nextYear();
      }, state.animationSpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.isAnimating, state.animationSpeed, nextYear]);

  return {
    ...state,
    setActiveCity,
    setActiveYear,
    setActiveLayer,
    setRasterOpacity,
    setShowBoundary,
    setIsAnimating,
    setAnimationSpeed,
    setBasemapStyle,
    toggleAnimation,
    nextYear,
    prevYear,
  };
}
