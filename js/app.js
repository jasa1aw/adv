// Current language
let currentLang = 'ru'

// Language flags and names
const languageData = {
	ru: { name: 'Русский', flag: '🇷🇺' },
	en: { name: 'English', flag: '🇺🇸' },
	kz: { name: 'Қазақша', flag: '🇰🇿' },
}

// Counter animation function
function animateCounters() {
	const counters = document.querySelectorAll('.stats-number')
	const speed = 200 // The lower the slower

	counters.forEach(counter => {
		const updateCount = () => {
			const target = +counter.getAttribute('data-target')
			const count = +counter.innerText.replace(/[^0-9]/g, '')

			// Lower inc to slow and higher to slow
			const inc = target / speed

			// Check if target is reached
			if (count < target) {
				// Add inc to count and output in counter
				const newCount = Math.ceil(count + inc)
				if (target.toString().includes('+')) {
					counter.innerText = newCount + '+'
				} else {
					counter.innerText = newCount
				}
				// Call function every ms
				setTimeout(updateCount, 1)
			} else {
				counter.innerText =
					target + (target.toString().includes('+') ? '' : '+')
			}
		}

		updateCount()
	})
}

// Intersection Observer for counter animation
function initCounterAnimation() {
	const statsSection = document.querySelector('.stats-section')
	if (!statsSection) return

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					animateCounters()
					observer.unobserve(entry.target) // Run animation only once
				}
			})
		},
		{
			threshold: 0.5,
		}
	)

	observer.observe(statsSection)
}

// Language switching
function initLanguageSwitcher() {
	// const dropdown = document.querySelector('.lang-dropdown')
	const trigger = document.querySelector('.lang-trigger')
	const menu = document.querySelector('.lang-menu')
	const options = document.querySelectorAll('.lang-option')

	// Toggle dropdown
	trigger.addEventListener('click', e => {
		e.stopPropagation()
		menu.classList.toggle('hidden')
	})

	// Close dropdown when clicking outside
	document.addEventListener('click', () => {
		menu.classList.add('hidden')
	})

	// Handle language selection
	options.forEach(option => {
		option.addEventListener('click', e => {
			e.stopPropagation()
			const newLang = option.dataset.lang
			if (newLang !== currentLang) {
				currentLang = newLang
				updateLanguageDisplay()
				updateLanguage()
				renderTeam()
				renderServices()
				menu.classList.add('hidden')
			}
		})
	})
}

// Update language display in dropdown
function updateLanguageDisplay() {
	const currentFlag = document.querySelector('.current-lang-flag')
	const currentName = document.querySelector('.current-lang-name')

	if (currentFlag && currentName) {
		currentFlag.textContent = languageData[currentLang].flag
		currentName.textContent = languageData[currentLang].name
	}
}

// Update language function
function updateLanguage() {
	const elements = document.querySelectorAll('[data-translate]')
	elements.forEach(element => {
		const key = element.dataset.translate
		if (translations[currentLang][key]) {
			element.innerHTML = translations[currentLang][key]
		}
	})

	const placeholderElements = document.querySelectorAll(
		'[data-placeholder-translate]'
	)
	placeholderElements.forEach(element => {
		const key = element.dataset.placeholderTranslate
		if (translations[currentLang][key]) {
			element.placeholder = translations[currentLang][key]
		}
	})
}

function renderServices() {
	const container = document.getElementById('servicesContainer')
	if (!container) return

	container.innerHTML = ''

	servicesData.forEach(service => {
		const serviceHtml = `
	<div class="service-item ${
		service.color
	} hover:bg-slate-800 text-white px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
        <span class="font-semibold text-center block" data-translate="${
					service.titleKey
				}">
		${translations[currentLang][service.titleKey]}
        </span>
	</div>
    `
		container.innerHTML += serviceHtml
	})
}

// Render team function
function renderTeam() {
	const container = document.getElementById('teamContainer')
	if (!container) return
	container.innerHTML = ''
	teamMembers.forEach((member, index) => {
		const isOdd = index % 2 === 1
		const memberHtml = `
	<div class="bg-white rounded-3xl shadow-lg overflow-hidden mb-8 ">
        <div class="flex flex-col ${
					isOdd ? 'lg:flex-row' : 'lg:flex-row-reverse'
				}">
          <!-- Photo Section -->
          <div class="lg:w-2/5">
            <img src="${member.image}" alt="${
			member.name[currentLang]
		}" class="w-full h-64 lg:h-full lg:object-cover md:object:cover object-contain object-center ">
          </div>
          
          <!-- Content Section -->
          <div class="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">${
							member.name[currentLang]
						}</h2>
            
            <p class="text-gray-700 mb-6 leading-relaxed text-base lg:text-lg">${
							member.description[currentLang]
						}</p>
            
            ${
							member.experience
								? `
            <div class="mb-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">${translations[currentLang].experience}</h4>
              <p class="text-gray-700 leading-relaxed text-base">${member.experience[currentLang]}</p>
            </div>
            `
								: ''
						}
            
            ${
							member.advantages
								? `
            <div class="mb-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">${translations[currentLang].advantages}</h4>
              <p class="text-gray-700 leading-relaxed text-base">${member.advantages[currentLang]}</p>
            </div>
            `
								: ''
						}
            
            ${
							member.expertise ||
							member.individualApproach ||
							member.confidentiality ||
							member.rightsProtection
								? `
            <div class="mb-6">
              <h4 class="text-lg font-bold text-gray-800 mb-4">${
								translations[currentLang].whyChoose
							}</h4>
              
              <div class="space-y-3">
                ${
									member.expertise
										? `
                <div class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-emerald rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong class="text-gray-800">${translations[currentLang].expertise}</strong>
                    <span class="text-gray-700 ml-1">${member.expertise[currentLang]}</span>
                  </div>
                </div>
                `
										: ''
								}
                
                ${
									member.individualApproach
										? `
                <div class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-emerald rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong class="text-gray-800">${translations[currentLang].individualApproach}</strong>
                    <span class="text-gray-700 ml-1">${member.individualApproach[currentLang]}</span>
                  </div>
                </div>
                `
										: ''
								}
                
                ${
									member.confidentiality
										? `<div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-emerald rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong class="text-gray-800">${translations[currentLang].confidentiality}</strong>
                      <span class="text-gray-700 ml-1">${member.confidentiality[currentLang]}</span>
                    </div>
                  </div>`
										: ''
								}
                
                ${
									member.rightsProtection
										? `<div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-emerald rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong class="text-gray-800">${translations[currentLang].rightsProtection}</strong>
                      <span class="text-gray-700 ml-1">${member.rightsProtection[currentLang]}</span>
                    </div>
                  </div>`
										: ''
								}
              </div>
            </div>
            `
								: ''
						}
            
            ${
							member.consultation
								? `
            <div class="mb-6">
              <p class="text-gray-700 italic text-base">${member.consultation[currentLang]}</p>
            </div>
            `
								: ''
						}
            
            <p class="text-gray-700 mb-6 text-base">${
							translations[currentLang].contactToday
						}</p>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/${
								member.contacts.whatsapp
							}" target="_blank" class="whatsapp-btn text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-3 font-semibold text-base transition-all duration-300 hover:transform hover:scale-105">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                <span>WhatsApp</span>
              </a>
              ${
								member.contacts.email
									? `
              <a href="mailto:${member.contacts.email}" class="email-btn text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-3 font-semibold text-base transition-all duration-300 hover:transform hover:scale-105">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>Email</span>
              </a>
              `
									: ''
							}
            </div>
          </div>
        </div>
      </div>
    `
		container.innerHTML += memberHtml
	})
}

// Initialize Swiper carousel
function initHeroCarousel() {
	// Check if Swiper is available
	if (typeof Swiper === 'undefined') {
		console.warn('Swiper library not loaded yet, retrying...')
		setTimeout(initHeroCarousel, 100)
		return
	}

	const heroCarousel = document.querySelector('.hero-carousel')
	if (!heroCarousel) {
		console.warn('Hero carousel element not found')
		return
	}

	// Show loading state
	heroCarousel.classList.add('loading')

	const swiper = new Swiper('.hero-carousel', {
		// Optional parameters
		direction: 'horizontal',
		loop: true,
		speed: 600,
		effect: 'slide',
		spaceBetween: 0,

		// Enable lazy loading for better performance
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 1,
		},

		// Optimize for performance
		simulateTouch: true,
		allowTouchMove: true,
		// resistanceRatio: 0.85,
		threshold: 10,
		// longSwipesRatio: 0.5,

		touchRatio: 1,
		touchAngle: 45,
		grabCursor: true,
		allowTouchMove: true,

		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			bulletClass: 'swiper-pagination-bullet',
			bulletActiveClass: 'swiper-pagination-bullet-active',
		},

		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},

		breakpoints: {
			320: {
				effect: 'slide',
				speed: 400,
				spaceBetween: 0,
				allowTouchMove: true,
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
			},
			// when window width is >= 480px
			480: {
				effect: 'slide',
				speed: 500,
				spaceBetween: 0,
			},
			// when window width is >= 768px
			768: {
				effect: 'fade',
				fadeEffect: {
					crossFade: true,
				},
				speed: 800,
			},
		},

		on: {
			init: function () {
				// Remove loading state
				heroCarousel.classList.remove('loading')

				// Optimize images loading after swiper initialization
				this.slides.forEach((slide, index) => {
					if (index === 0) {
						// Immediately load first slide images
						const images = slide.querySelectorAll('img[data-src]')
						images.forEach(img => {
							img.src = img.dataset.src
							img.removeAttribute('data-src')
						})
					}
				})

				// Mark carousel as ready
				heroCarousel.setAttribute('data-swiper-ready', 'true')
			},
			slideChange: function () {
				if (window.innerWidth <= 480) {
					setTimeout(() => {
						this.update()
					}, 100)
				}
			},
		},
	})

	// Preload next slide for smoother transitions
	swiper.on('slideChange', function () {
		const nextIndex = this.activeIndex + 1
		const nextSlide = this.slides[nextIndex]
		if (nextSlide) {
			const images = nextSlide.querySelectorAll('img[data-src]')
			images.forEach(img => {
				img.src = img.dataset.src
				img.removeAttribute('data-src')
			})
		}
	})

	// Return swiper instance for further use
	return swiper
}

const WHATSAPP_NUMBER = '77002929573'

function sendToWhatsApp(data) {
	let caseTypeText = ''
	switch (data.caseType) {
		case 'criminal':
			caseTypeText = 'уголовному делу'
			break
		case 'administrative':
			caseTypeText = 'административному правонарушению'
			break
		case 'civil':
			caseTypeText = 'гражданскому спору'
			break
		default:
			caseTypeText = 'правовому вопросу'
	}

	const message = `Здравствуйте! Меня зовут ${data.fullName}. Обращаюсь к вам по ${caseTypeText}. Моя ситуация: ${data.message}
Мой контактный номер: ${data.phone}
Прошу связаться со мной для получения консультации.
С уважением, ${data.fullName}`

	// Create WhatsApp URL
	const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
		message
	)}`

	window.open(whatsappUrl, '_blank')
}

// Phone mask formatting
function formatPhoneNumber(value) {
	// Remove all non-digit characters
	const numbers = value.replace(/\D/g, '')

	// If empty, return empty string
	if (numbers.length === 0) {
		return ''
	}

	// Always start with 7 for Kazakhstan
	let cleanNumbers = numbers
	if (numbers.startsWith('8')) {
		cleanNumbers = '7' + numbers.substring(1)
	} else if (!numbers.startsWith('7')) {
		cleanNumbers = '7' + numbers
	}

	// Limit to 11 digits total (7 + 10 digits)
	cleanNumbers = cleanNumbers.substring(0, 11)

	// Start with +7
	let formatted = '+7'

	// Add area code in parentheses
	if (cleanNumbers.length > 1) {
		formatted += ' (' + cleanNumbers.substring(1, 4)
		if (cleanNumbers.length >= 4) {
			formatted += ')'
			if (cleanNumbers.length > 4) {
				formatted += ' '
			}
		}
	}

	// Add first part of number
	if (cleanNumbers.length >= 5) {
		formatted += cleanNumbers.substring(4, 7)
		if (cleanNumbers.length > 7) {
			formatted += ' '
		}
	}

	// Add second part of number
	if (cleanNumbers.length >= 8) {
		formatted += cleanNumbers.substring(7, 9)
		if (cleanNumbers.length > 9) {
			formatted += ' '
		}
	}

	// Add last part of number
	if (cleanNumbers.length >= 10) {
		formatted += cleanNumbers.substring(9, 11)
	}

	return formatted
}

function validatePhone(phone) {
	const cleanPhone = phone.replace(/\D/g, '')

	return cleanPhone.length === 11 && cleanPhone.startsWith('7')
}

function showError(input, message) {
	input.classList.add('form-error')
	const errorDiv = input.parentNode.querySelector('.error-message')
	if (errorDiv) {
		errorDiv.textContent = message
		errorDiv.classList.remove('hidden')
	}
}

function hideError(input) {
	input.classList.remove('form-error')
	const errorDiv = input.parentNode.querySelector('.error-message')
	if (errorDiv) {
		errorDiv.classList.add('hidden')
	}
}

function validateForm(form) {
	let isValid = true

	const phoneInput = form.querySelector('input[name="phone"]')
	const messageInput = form.querySelector('textarea[name="message"]')

	// Clear previous errors
	;[phoneInput, messageInput].forEach(input => {
		if (input) hideError(input)
	})

	// Validate phone
	if (phoneInput) {
		if (!phoneInput.value.trim()) {
			showError(phoneInput, 'Пожалуйста, введите номер телефона')
			isValid = false
		} else if (!validatePhone(phoneInput.value)) {
			showError(phoneInput, 'Введите корректный номер телефона')
			isValid = false
		}
	}

	// Validate message
	if (messageInput) {
		if (!messageInput.value.trim()) {
			showError(messageInput, 'Пожалуйста, опишите вашу ситуацию')
			isValid = false
		} else if (messageInput.value.trim().length < 5) {
			showError(
				messageInput,
				'Опишите ситуацию более подробно (минимум 10 символов)'
			)
			isValid = false
		}
	}

	return isValid
}

// Form submission
function initForm() {
	// Handle all consultation forms
	const forms = document.querySelectorAll('.consultation-form')

	forms.forEach(form => {
		form.addEventListener('submit', e => {
			e.preventDefault()

			if (validateForm(form)) {
				const caseType = form.dataset.caseType
				const formData = new FormData(form)

				// Get form data
				const data = {
					fullName: formData.get('fullName'),
					phone: formData.get('phone'),
					message: formData.get('message'),
					caseType: caseType,
					timestamp: new Date().toISOString(),
				}

				sendToWhatsApp(data)

				// Reset form
				form.reset()
			}
		})

		// Real-time validation and phone mask
		const inputs = form.querySelectorAll('input, textarea')
		inputs.forEach(input => {
			// Add phone mask for phone inputs
			if (input.type === 'tel' || input.name === 'phone') {
				// Set initial placeholder and value
				input.placeholder = '+7 (___) ___ __ __'

				input.addEventListener('input', e => {
					const cursorPosition = e.target.selectionStart
					const oldLength = e.target.value.length

					// Format the phone number
					const formatted = formatPhoneNumber(e.target.value)
					e.target.value = formatted

					// Adjust cursor position
					const newLength = formatted.length
					const diff = newLength - oldLength
					e.target.setSelectionRange(
						cursorPosition + diff,
						cursorPosition + diff
					)

					// Clear error if exists
					if (input.classList.contains('form-error')) {
						hideError(input)
					}
				})

				input.addEventListener('focus', e => {
					if (!e.target.value || e.target.value === '') {
						e.target.value = '+7 ('
						setTimeout(() => {
							e.target.setSelectionRange(4, 4)
						}, 0)
					}
				})

				input.addEventListener('blur', e => {
					if (e.target.value === '+7 (' || e.target.value === '+7') {
						e.target.value = ''
					}
					// Validate phone after blur
					if (e.target.value.trim()) {
						validateForm(form)
					}
				})

				input.addEventListener('keydown', e => {
					// Allow backspace, delete, tab, escape, enter
					if (
						[8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
						// Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
						(e.keyCode === 65 && e.ctrlKey === true) ||
						(e.keyCode === 67 && e.ctrlKey === true) ||
						(e.keyCode === 86 && e.ctrlKey === true) ||
						(e.keyCode === 88 && e.ctrlKey === true)
					) {
						return
					}
					// Ensure that it is a number and stop the keypress
					if (
						(e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
						(e.keyCode < 96 || e.keyCode > 105)
					) {
						e.preventDefault()
					}
				})
			} else {
				// Regular input validation
				input.addEventListener('input', () => {
					if (input.classList.contains('form-error')) {
						hideError(input)
					}
				})
			}

			// Common blur validation (not for phone inputs)
			if (!(input.type === 'tel' || input.name === 'phone')) {
				input.addEventListener('blur', () => {
					if (input.value.trim()) {
						validateForm(form)
					}
				})
			}
		})
	})
}

// Smooth scroll to section
function scrollToSection(sectionId) {
	const section = document.getElementById(sectionId)
	if (section) {
		section.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}
}

// Initialize scroll navigation
function initScrollNavigation() {
	// Navigation links
	const navLinks = document.querySelectorAll('[data-scroll]')
	navLinks.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			const targetId = link.getAttribute('data-scroll')
			scrollToSection(targetId)
		})
	})
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
	initLanguageSwitcher()
	updateLanguageDisplay()
	updateLanguage()
	renderTeam()
	renderServices()
	initForm()
	initCounterAnimation()
	initScrollNavigation()
	// Swiper initialization moved to early loader
})

// Early Swiper initialization for faster carousel loading
if (document.readyState === 'loading') {
	// DOM is still loading, wait for it
	document.addEventListener('DOMContentLoaded', function () {
		// Try to initialize Swiper early if elements are ready
		const heroCarousel = document.querySelector('.hero-carousel')
		if (heroCarousel && typeof Swiper !== 'undefined') {
			initHeroCarousel()
		}
	})
} else {
	// DOM is already loaded
	if (typeof Swiper !== 'undefined') {
		initHeroCarousel()
	} else {
		// Wait for Swiper to load
		const checkSwiper = setInterval(() => {
			if (typeof Swiper !== 'undefined') {
				initHeroCarousel()
				clearInterval(checkSwiper)
			}
		}, 50)
	}
}
