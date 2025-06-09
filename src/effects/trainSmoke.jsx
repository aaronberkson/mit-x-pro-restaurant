import React, { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";

// Constants for manually adjusting the smoke origin and behavior
const SMOKE_ORIGIN_X = 116; // Exact horizontal origin for the chimney
const SMOKE_ORIGIN_Y = 44; // Exact vertical origin for the chimney
const INITIAL_PARTICLE_COUNT = 50; // High particle count during the burst
const NORMAL_PARTICLE_COUNT = 20; // Particle count after the animation
const ANIMATION_DURATION_FRAMES = 45; // 0.75 seconds at 60 FPS

// Adjustable constants for size and movement
const START_WIDTH = 4; // Initial width of particles
const START_HEIGHT = 6; // Initial height of particles
const MAX_WIDTH = 10; // Maximum width as particles rise
const MAX_HEIGHT = 16; // Maximum height as particles rise
const GROWTH_RATE = 0.02; // Rate at which particles grow
const RISE_SPEED = 0.15; // Slower upward motion
const WIND_ANGLE = 0.3; // Horizontal drift speed (wind blowing right to left)
const CURVE_TOP_FACTOR = 1.25; // Controls how rounded the top of the droplet is

const TrainSmoke = () => {
  const pixiContainerRef = useRef(null); // Reference for container DOM element
  const appRef = useRef(null);

  useEffect(() => {
    const app = new Application();
    (async () => {
      await app.init({
        width: 200,
        height: 200,
        backgroundAlpha: 0, // Transparent background
      });
      appRef.current = app;

      // Attach the canvas to the container
      if (pixiContainerRef.current) {
        pixiContainerRef.current.appendChild(app.canvas); // Use compliant "canvas" property
      } else {
        console.error("[TrainSmoke] Container reference is null");
        return;
      }

      // Create a container for smoke particles
      const smokeContainer = new Container();
      app.stage.addChild(smokeContainer);

      // Generate smoke particles
      const smokeParticles = [];
      const createParticles = (count) => {
        for (let i = 0; i < count; i++) {
          const smokeParticle = new Graphics();
          const baseWidth = Math.random() * START_WIDTH + START_WIDTH / 2;
          const baseHeight = Math.random() * START_HEIGHT + START_HEIGHT / 2;

          // Draw upside-down droplet shapes with adjustable curve top
          smokeParticle
            .moveTo(0, baseHeight) // Start at the bottom center
            .quadraticCurveTo(
              -baseWidth * CURVE_TOP_FACTOR, 
              baseHeight / 2, 
              0, 
              0
            ) // Left curve to the top
            .quadraticCurveTo(
              baseWidth * CURVE_TOP_FACTOR, 
              baseHeight / 2, 
              0, 
              baseHeight
            ) // Right curve back down
            .closePath()
            .fill({ color: 0xd3d3d3, alpha: Math.random() * 0.5 + 0.5 }); // Semi-transparent gray fill

          // Stable origin for all particles
          smokeParticle.x = SMOKE_ORIGIN_X;
          smokeParticle.y = SMOKE_ORIGIN_Y;

          // Initial transparency
          smokeParticle.alpha = Math.random() * 0.8 + 0.2;

          smokeParticles.push(smokeParticle);
          smokeContainer.addChild(smokeParticle);
        }
      };

      // Start with an immediate burst
      createParticles(INITIAL_PARTICLE_COUNT);

      // Animation logic
      let animationFrameCount = 0;
      app.ticker.add(() => {
        animationFrameCount++;

        smokeParticles.forEach((particle, index) => {
          // Adjust size to grow as the particle rises
          if (particle.scale.x < MAX_WIDTH / START_WIDTH) {
            particle.scale.x += GROWTH_RATE;
            particle.scale.y += GROWTH_RATE;
          }

          // Adjust motion for slower rise and leftward drift
          particle.y -= RISE_SPEED + Math.random() * 0.1; // Controlled upward motion
          particle.x -= WIND_ANGLE + Math.random() * 0.2; // Leftward drift (wind-like)
          particle.alpha -= 0.01; // Gradual fade-out

          // Reset particle properties for continuous looping
          if (particle.alpha <= 0) {
            particle.y = SMOKE_ORIGIN_Y;
            particle.x = SMOKE_ORIGIN_X;
            particle.scale.set(1, 1); // Reset scaling to original size
            particle.alpha = Math.random() * 0.8 + 0.2; // Fade back in
          }

          // Gradually reduce particle count after animation duration
          if (animationFrameCount > ANIMATION_DURATION_FRAMES && index >= NORMAL_PARTICLE_COUNT) {
            smokeContainer.removeChild(particle); // Remove from container
          }
        });

        // Cap the particles array size to the normal count after animation
        if (animationFrameCount > ANIMATION_DURATION_FRAMES) {
          smokeParticles.length = NORMAL_PARTICLE_COUNT;
        }
      });
    })();

    // Clean up on component unmount
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, true); // Properly destroy the application
      }
    };
  }, []);

  return (
    <div
      ref={pixiContainerRef}
      style={{
        position: "absolute",
        top: "-20px",
        left: "10px",
        width: "200px",
        height: "200px",
        pointerEvents: "none", // Prevent blocking interactions
      }}
    />
  );
};

export default TrainSmoke;
