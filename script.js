document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.querySelector('.carousel')
	const slides = document.querySelectorAll('.carousel-slide')
	const prevBtn = document.querySelector('.carousel-control.prev')
	const nextBtn = document.querySelector('.carousel-control.next')
	const indicators = document.querySelectorAll('.carousel-indicators button')
	let currentSlide = 0
	const slideCount = slides.length

	function initCarousel() {
		slides.forEach((slide, index) => {
			slide.style.display = index === 0 ? 'flex' : 'none'
		})
		updateIndicators()
	}

	function updateIndicators() {
		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('bg-white', index === currentSlide)
			indicator.classList.toggle('bg-white/50', index !== currentSlide)
		})
	}

	function goToSlide(index) {
		slides[currentSlide].style.display = 'none'
		currentSlide = (index + slideCount) % slideCount
		slides[currentSlide].style.display = 'flex'
		updateIndicators()
	}

	prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1))
	nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1))

	indicators.forEach((indicator, index) => {
		indicator.addEventListener('click', () => goToSlide(index))
	})

	setInterval(() => goToSlide(currentSlide + 1), 5000)

	initCarousel()
})

// Валидация формы
document.addEventListener('DOMContentLoaded', function () {
	const forms = document.querySelectorAll('#consultationForm')

	forms.forEach(form => {
		const phoneInput = form.querySelector('input[type="tel"]')
		const phoneError = phoneInput.nextElementSibling

		phoneInput.addEventListener('input', function () {
			const phonePattern =
				/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
			if (!phonePattern.test(this.value)) {
				phoneError.textContent = 'Введите корректный номер телефона'
				phoneError.classList.remove('hidden')
			} else {
				phoneError.classList.add('hidden')
			}
		})

		// Обработка отправки формы
		form.addEventListener('submit', function (e) {
			e.preventDefault()

			// const namePattern = /^[А-Яа-яЁё\s]{2,}$/
			const phonePattern =
				/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

			let isValid = true

			if (!phonePattern.test(phoneInput.value)) {
				phoneError.textContent = 'Введите корректный номер телефона'
				phoneError.classList.remove('hidden')
				isValid = false
			}

			if (isValid) {
				form.reset()
			}
		})
	})
})
