// Intro animation: Bee flies to navbar logo on page load
(function() {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('Animation skipped: prefers-reduced-motion is enabled');
    return;
  }

  // Wait for DOM to be ready and GSAP to be loaded
  function initAnimation() {
    const flyingBeeContainer = document.getElementById('flying-bee-container');
    const beeIcon = document.querySelector('.bee-icon');
    
    if (!flyingBeeContainer || !beeIcon || !window.gsap) {
      setTimeout(initAnimation, 100);
      return;
    }

    // Get the position of the target navbar bee icon
    const beeRect = beeIcon.getBoundingClientRect();
    const targetX = beeRect.left + beeRect.width / 2;
    const targetY = beeRect.top + beeRect.height / 2;

    // Starting position (bottom right)
    const startX = window.innerWidth - 60;
    const startY = window.innerHeight - 60;

    // Create an S-shaped curve path
    // First curve goes up and to the left, second curve continues to target
    const midX1 = window.innerWidth * 0.7;
    const midY1 = window.innerHeight * 0.6;
    const midX2 = window.innerWidth * 0.3;
    const midY2 = window.innerHeight * 0.3;

    const path = `M ${startX} ${startY} Q ${midX1} ${midY1} ${midX2} ${midY2} T ${targetX} ${targetY}`;

    // Reset position and ensure visibility
    gsap.set(flyingBeeContainer, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0
    });

    // Create the timeline
    const timeline = gsap.timeline();

    // Simple S-shaped flight animation
    timeline.to(flyingBeeContainer, {
      motionPath: {
        path: path,
        align: 'self',
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      duration: 2.5,
      ease: 'power1.inOut'
    });

    // Fade out as it lands
    timeline.to(flyingBeeContainer, {
      opacity: 0,
      duration: 0.3
    }, '-=0.2');

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
