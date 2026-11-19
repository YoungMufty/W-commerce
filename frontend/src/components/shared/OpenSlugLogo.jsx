import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * OpenSlugLogo - Next-Gen 3D Blender-rendered logo with high-end Framer Motion physics.
 * Features:
 * - Interactive 3D cursor tilt with spring dynamics
 * - Ambient levitation & breathing cycle
 * - Diagonal metallic light-sweep / shimmer beam
 * - Cybernetic ambient neon aura
 * - Micro-interaction tactile click / hover states
 */
const OpenSlugLogo = ({
  size = 'md',
  showText = true,
  showBadge = true,
  showTagline = true,
  className = '',
  onClick
}) => {
  const containerRef = useRef(null);

  // Motion values for interactive 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 260 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Dimension mapping
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 rounded-xl',
      text: 'text-base',
      badge: 'text-[9px] px-1.5 py-0.5',
      glow: 'w-8 h-8',
    },
    md: {
      box: 'w-10 h-10 rounded-2xl',
      text: 'text-lg',
      badge: 'text-[10px] px-2 py-0.5',
      glow: 'w-10 h-10',
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl',
      text: 'text-xl',
      badge: 'text-[11px] px-2.5 py-0.5',
      glow: 'w-12 h-12',
    },
    xl: {
      box: 'w-16 h-16 rounded-3xl',
      text: 'text-2xl',
      badge: 'text-xs px-3 py-1',
      glow: 'w-16 h-16',
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group select-none cursor-pointer ${className}`}
      style={{ perspective: 800 }}
    >
      {/* 3D Animated Emblem Container */}
      <motion.div
        className="relative shrink-0"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94, rotateZ: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        {/* Pulsing Emerald / Neon Cyan Ambient Halo */}
        <motion.div
          animate={{
            opacity: [0.35, 0.7, 0.35],
            scale: [0.92, 1.1, 0.92],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 opacity-50 blur-md pointer-events-none ${currentSize.glow}`}
        />

        {/* 3D Sculptural Emblem Squircle */}
        <motion.div
          animate={{
            y: [0, -2.5, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative overflow-hidden ${currentSize.box} bg-gradient-to-br from-slate-900 via-neutral-950 to-black p-0.5 border border-emerald-500/40 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(16,185,129,0.25)] flex items-center justify-center`}
        >
          {/* 3D Blender Cycles Render Image */}
          <img
            src="/openslug-emblem.jpg"
            alt="OpenSlug 3D Logo"
            className="w-full h-full object-cover rounded-[inherit] transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to transparent PNG or SVG if needed
              e.currentTarget.src = '/openslug-emblem-transparent.png';
            }}
          />

          {/* Diagonal Metallic Shimmer Sweep */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none -top-1/2"
            style={{ transform: 'rotate(28deg)' }}
            animate={{
              x: ['-180%', '240%'],
            }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Crisp Specular Inner Rim */}
          <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Typography & Badge Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <motion.span
              className={`font-black tracking-tight text-[var(--text-main)] leading-tight ${currentSize.text}`}
              whileHover={{ x: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Open<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">Slug</span>
            </motion.span>

            {showBadge && (
              <motion.span
                whileHover={{ scale: 1.08 }}
                className={`font-black tracking-wider uppercase rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.2)] ${currentSize.badge}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PRO</span>
              </motion.span>
            )}
          </div>

          {showTagline && (
            <span className="text-[10px] font-bold tracking-normal text-[var(--text-muted)] leading-tight hidden md:block">
              Open Commerce <span className="text-emerald-500/80">•</span> Instant Direct Orders
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OpenSlugLogo;
