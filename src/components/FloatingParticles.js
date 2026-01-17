import React, { useEffect, useRef, useMemo } from 'react';

const FloatingParticles = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resizeCanvas = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    // Particle count based on device
    const particleCount = isMobile ? 25 : 50;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: height + Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.5 + 0.2,
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.y -= particle.speedY;
        particle.x += particle.speedX;
        particle.pulse += particle.pulseSpeed;

        // Pulsing opacity effect
        const pulsingOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));

        // Reset particle when it goes off screen
        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        // Wrap horizontally
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;

        // Draw particle with glow effect
        ctx.beginPath();

        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 107, 53, ${pulsingOpacity})`);
        gradient.addColorStop(0.4, `rgba(255, 107, 53, ${pulsingOpacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');

        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 140, 95, ${pulsingOpacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="floating-particles"
      aria-hidden="true"
    />
  );
};

export default FloatingParticles;
