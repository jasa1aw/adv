// Swiper Loading Optimizer
// This module provides utilities to optimize Swiper loading performance

;(function () {
	'use strict'

	// Performance monitoring
	let swiperLoadStart = performance.now()

	// Create performance observer for monitoring
	if ('PerformanceObserver' in window) {
		const observer = new PerformanceObserver(list => {
			list.getEntries().forEach(entry => {
				if (entry.name.includes('swiper') || entry.name.includes('carousel')) {
					console.log(
						`Swiper resource loaded: ${entry.name} in ${entry.duration}ms`
					)
				}
			})
		})
		observer.observe({ entryTypes: ['resource'] })
	}

	// Preload critical carousel resources
	function preloadCarouselResources() {
		// Preload background images used in carousel
		const backgrounds = ['./images/backgroundHero.webp']

		backgrounds.forEach(src => {
			const link = document.createElement('link')
			link.rel = 'preload'
			link.as = 'image'
			link.href = src
			document.head.appendChild(link)
		})
	}

	// Optimize carousel container for faster rendering
	function optimizeCarouselContainer() {
		const heroCarousel = document.querySelector('.hero-carousel')
		if (heroCarousel) {
			// Set initial styles to prevent layout shift
			heroCarousel.style.minHeight = '500px'
			heroCarousel.style.contain = 'layout'
			heroCarousel.style.willChange = 'transform'

			// Add loading indicator
			if (!heroCarousel.querySelector('.loading-indicator')) {
				const loadingIndicator = document.createElement('div')
				loadingIndicator.className = 'loading-indicator'
				loadingIndicator.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #f59e0b;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    z-index: 10;
                `
				heroCarousel.appendChild(loadingIndicator)

				// Add animation styles
				if (!document.querySelector('#swiper-loading-styles')) {
					const style = document.createElement('style')
					style.id = 'swiper-loading-styles'
					style.textContent = `
                        @keyframes spin {
                            0% { transform: translate(-50%, -50%) rotate(0deg); }
                            100% { transform: translate(-50%, -50%) rotate(360deg); }
                        }
                    `
					document.head.appendChild(style)
				}
			}
		}
	}

	// Remove loading indicator when swiper is ready
	function removeLoadingIndicator() {
		const loadingIndicator = document.querySelector('.loading-indicator')
		if (loadingIndicator) {
			loadingIndicator.style.opacity = '0'
			setTimeout(() => {
				loadingIndicator.remove()
			}, 300)
		}
	}

	// Monitor swiper initialization
	function monitorSwiperInit() {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-swiper-ready'
				) {
					const swiperLoadEnd = performance.now()
					console.log(
						`Swiper fully loaded in ${swiperLoadEnd - swiperLoadStart}ms`
					)
					removeLoadingIndicator()
					observer.disconnect()
				}
			})
		})

		const heroCarousel = document.querySelector('.hero-carousel')
		if (heroCarousel) {
			observer.observe(heroCarousel, { attributes: true })
		}
	}

	// Initialize optimizations
	function init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				preloadCarouselResources()
				optimizeCarouselContainer()
				monitorSwiperInit()
			})
		} else {
			preloadCarouselResources()
			optimizeCarouselContainer()
			monitorSwiperInit()
		}
	}

	// Auto-initialize
	init()

	// Export utilities for manual use
	window.SwiperOptimizer = {
		preloadCarouselResources,
		optimizeCarouselContainer,
		removeLoadingIndicator,
		monitorSwiperInit,
	}
})()
