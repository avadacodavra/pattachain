'use client';

import { useEffect, useRef } from 'react';

type MousePosition = {
  x: number;
  y: number;
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
};

function createParticle(width: number, height: number): Particle {
  const x = Math.random() * width;
  const y = Math.random() * height;

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    size: Math.random() * 1.5 + 0.5,
  };
}

function updateParticle(particle: Particle, mouse: MousePosition) {
  const dx = mouse.x - particle.x;
  const dy = mouse.y - particle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 150;

  if (distance > 0 && distance < maxDistance) {
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const force = (maxDistance - distance) / maxDistance;

    particle.x -= forceDirectionX * force * 5;
    particle.y -= forceDirectionY * force * 5;
    return;
  }

  if (particle.x !== particle.baseX) {
    particle.x -= (particle.x - particle.baseX) / 20;
  }

  if (particle.y !== particle.baseY) {
    particle.y -= (particle.y - particle.baseY) / 20;
  }
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  mouse: MousePosition,
  particleRGB: string
) {
  ctx.fillStyle = `rgba(${particleRGB}, 0.42)`;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();

  const dx = mouse.x - particle.x;
  const dy = mouse.y - particle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 150) {
    ctx.strokeStyle = `rgba(${particleRGB}, ${0.45 - distance / 320})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let particleRGB = '31, 119, 180';
    const mouse: MousePosition = { x: -1000, y: -1000 };

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 5000;

      for (let i = 0; i < numberOfParticles; i += 1) {
        particles.push(createParticle(canvas.width, canvas.height));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const syncPalette = () => {
      const styles = getComputedStyle(document.documentElement);
      particleRGB = styles.getPropertyValue('--particle-rgb').trim() || '31, 119, 180';
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        updateParticle(particle, mouse);
        drawParticle(ctx, particle, mouse, particleRGB);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new MutationObserver(syncPalette);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    syncPalette();
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 h-full w-full -z-10 pointer-events-none bg-background opacity-80" />;
}
