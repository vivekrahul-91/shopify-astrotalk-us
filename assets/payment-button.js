if (!window.Eurus.loadedScript.includes('payment-button.js')) {
  window.Eurus.loadedScript.push('payment-button.js');

  document.addEventListener('alpine:init', () => {
      Alpine.store('xShopifyPaymentBtn', {
        load(e) {
          (events => {
            const init = () => {
              events.forEach(type => window.removeEventListener(type, init));

              // If payment button HTML is stored in data attribute, load it
              if (e.getAttribute('data-shopify-payment-button')) {
                e.innerHTML = e.getAttribute('data-shopify-payment-button');
                e.removeAttribute('data-shopify-payment-button');
              }
              
              // Initialize Shopify payment button if available
              // This will initialize payment buttons whether they're already in the DOM
              // or were just loaded from a data attribute
              if (Shopify && Shopify.PaymentButton) {
                // Use requestAnimationFrame to ensure DOM is ready
                requestAnimationFrame(() => {
                  Shopify.PaymentButton.init();
                });
              }
            };
          
            // Initialize immediately if HTML is already present, otherwise wait for user interaction
            if (e.innerHTML.trim() || e.querySelector('[data-shopify="payment-button"]') || e.querySelector('.shopify-payment-button')) {
              init();
            } else {
              events.forEach(type => window.addEventListener(type, init, {once: true, passive: true}));
            }
          })(['touchstart', 'mouseover', 'wheel', 'scroll', 'keydown']);
        },
      });
    });
}