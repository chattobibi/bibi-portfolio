// Intro animation: Bee flies to navbar logo on page load
(function() {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip animation entirely for users with reduced motion preference
    console.log('Animation skipped: prefers-reduced-motion is enabled');
    return;
  }

  // Wait for DOM to be ready and GSAP to be loaded
  function initAnimation() {
    const flyingBeeContainer = document.getElementById('flying-bee-container');
    const beeIcon = document.querySelector('.bee-icon');
    
    if (!flyingBeeContainer || !beeIcon || !window.gsap) {
      // Retry if elements or GSAP not ready
      setTimeout(initAnimation, 100);
      return;
    }

    // Get the position of the target navbar bee icon
    const beeRect = beeIcon.getBoundingClientRect();
    const targetX = beeRect.left + beeRect.width / 2;
    const targetY = beeRect.top + beeRect.height / 2;

    // Get viewport dimensions for starting position
    const startX = window.innerWidth - 100;
    const startY = window.innerHeight - 100;

    // Create SVG path for curved motion
    const controlX = window.innerWidth / 2;
    const controlY = window.innerHeight / 2;
    
    const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;

    // Create canvas for trail effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '199';
    document.body.insertBefore(canvas, flyingBeeContainer);
    
    const ctx = canvas.getContext('2d');
    const trailPoints = [];
    
    // Reduce bee size
    flyingBeeContainer.style.fontSize = '16px';
    
    // Reset position and ensure visibility
    gsap.set(flyingBeeContainer, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0
    });

    // Create the timeline
    const timeline = gsap.timeline();

    // Main flight animation with MotionPathPlugin
    timeline.to(flyingBeeContainer, {
      motionPath: {
        path: path,
        align: 'self',
        autoRotate: true, // Bank into turns
        alignOrigin: [0.5, 0.5] // Center of rotation
      },
      duration: 1.8,
      ease: 'power1.inOut',
      // Track position for trail drawing
      onUpdate: function() {
        const rect = flyingBeeContainer.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Add to trail every few pixels
        if (trailPoints.length === 0 || 
            Math.hypot(x - trailPoints[trailPoints.length - 1].x, 
                      y - trailPoints[trailPoints.length - 1].y) > 8) {
          trailPoints.push({ x, y });
        }
        
        // Draw trail
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(96, 109, 93, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]); // Dotted line
        ctx.lineCap = 'round';
        
        if (trailPoints.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
          for (let i = 1; i < trailPoints.length; i++) {
            ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
          }
          ctx.stroke();
        }
      }
    });

    // Add swaying motion (side to side and up/down)
    // This runs in parallel with the main animation
    timeline.to(flyingBeeContainer, {
      y: '+=15px', // Slight vertical sway
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 8, // Repeat throughout most of flight
      repeatDelay: 0.1
    }, 0); // Start at same time as main animation

    // Add horizontal sway
    timeline.to(flyingBeeContainer, {
      x: '+=12px', // Slight horizontal sway
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 7,
      repeatDelay: 0.15
    }, 0); // Start at same time

    // Fade out as it lands (overlapping with the end of flight)
    timeline.to(flyingBeeContainer, {
      opacity: 0,
      duration: 0.3
    }, '-=0.15'); // Start fade 0.15s before flight ends

    // Clean up after animation
    timeline.eventCallback('onComplete', () => {
      flyingBeeContainer.style.display = 'none';
      canvas.style.opacity = '0';
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => canvas.remove()
      });
    });
  }

  // Start when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
    initAnimation();
  }
})();
