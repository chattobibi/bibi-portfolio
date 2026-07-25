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
    // Calculate control points for a natural curved path
    const controlX = window.innerWidth / 2;
    const controlY = window.innerHeight / 2;
    
    const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;

    // Reset position and ensure visibility
    gsap.set(flyingBeeContainer, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0
    });

    // Create the timeline
    const timeline = gsap.timeline();

    // Flight animation with MotionPathPlugin
    timeline.to(flyingBeeContainer, {
      motionPath: {
        path: path,
        align: 'self',
        autoRotate: true, // Bank into turns
        alignOrigin: [0.5, 0.5] // Center of rotation
      },
      duration: 1.8,
      ease: 'power1.inOut'
    });

    // Fade out as it lands (overlapping with the end of flight)
    timeline.to(flyingBeeContainer, {
      opacity: 0,
      duration: 0.3
    }, '-=0.15'); // Start fade 0.15s before flight ends

    // Clean up after animation
    timeline.eventCallback('onComplete', () => {
      flyingBeeContainer.style.display = 'none';
    });
  }

  // Start when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
    initAnimation();
  }
})();
