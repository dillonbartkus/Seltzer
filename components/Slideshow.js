import anime from 'animejs'

const defaultOptions = {
  buttons: true,
  dots: true
}

class Slideshow {
	constructor( elem, options = defaultOptions ) {
		this.elem = elem
    this.inner = document.querySelector('.inner')
    this.slider = document.querySelector('.slider')
    this.slides = [...this.slider.children]
    this.currentSlideIndex = 0
    this.isSliding = false
    this.isDead = false
    this.init()
    this.on = this.on.bind(this)
    this.options = options
	}

  // afterNext = after next slide
  // afterPrev - after prev slide
  // afterSlide - after all slides
  on(evt, fn) {
    return this.elem.addEventListener(evt, fn, false);
  }

  triggerCallback(cb) {
    if ( typeof cb === 'function' ) {
      cb()
    } else {
      console.log('no callback');
    }
  }

  generateSlider(cb) {
    this.parentWidth = this.parent.offsetWidth
    this.getMaxHeight()
    this.setParent()
    this.setSlides()
    this.repositionSlider()
    this.triggerCallback(cb)
  }

  getMaxHeight(){
    let maxHeight = 0
    this.slides.map(  (slide) => {
      if ( slide.offsetHeight > maxHeight ) {
        maxHeight = slide.offsetHeight
      }
    } )
    this.slider.style.height = `${maxHeight}px`
  }

  repositionSlider(){
    let position = this.currentSlideIndex * this.parentWidth
    this.slider.style.transform = `translateX(-${position}px)`
  }

  setSlides() {
    let lastSlideIndex = this.slides.length - 1

    this.slides.forEach( (slide, i) => {
      slide.style.width = `${this.parentWidth}px`
      slide.style.position = 'absolute'
      slide.style.top = '0px'
      slide.style.left = `${i*this.parentWidth}px`
    } )
  }


  setParent() {
    this.elem.style.overflow = 'hidden'
    this.inner.style.position = 'relative'
    this.inner.style.width = this.slides.length * this.parentWidth
  }


  animateSlider(moveToIndex, direction) {
    anime({
      targets: this.slider,
      translateX: [
        { value: -1 * (moveToIndex * this.parentWidth), duration: 700 }
      ],
      easing: 'easeOutExpo',
      complete: () => {

        if (direction === 'prev') {
          this.elem.dispatchEvent(new CustomEvent('afterPrev'))
        }

        if(direction === 'next'){
          this.elem.dispatchEvent(new CustomEvent('afterNext'))
        }

        this.elem.dispatchEvent(new CustomEvent('afterSlide'))

        if ( this.nextSlideIndex < 0) {
          this.slides[this.slides.length - 1].style.left = `${(this.slides.length - 1) * this.parentWidth}px`
          this.slider.style.transform = `translateX(-${(this.slides.length - 1) * this.parentWidth}px)`
          this.currentSlideIndex = this.slides.length - 1
        }

        if ( this.nextSlideIndex > this.slides.length - 1) {
          this.slides[0].style.left = '0px'
          this.slider.style.transform = 'translateX(0px)'
          this.currentSlideIndex = 0
        }

        this.isSliding = false

      }
    })
  }

  positionFirstSlide(){
    let firstSlide = this.slides[0]
    firstSlide.style.left = `${this.slides.length * this.parentWidth}px`
  }

  positionLastSlide(){
    let lastSlide = this.slides[this.slides.length - 1]
    lastSlide.style.left = `-${this.parentWidth}px`
  }

  nextSlide() {
    this.nextSlideIndex = this.currentSlideIndex + 1

    if( this.nextSlideIndex > this.slides.length - 1) {
      this.positionFirstSlide()
      this.animateSlider(this.nextSlideIndex, 'next')
    }else{
      this.animateSlider(this.nextSlideIndex, 'next')
      this.currentSlideIndex = this.nextSlideIndex
    }
  }

  prevSlide() {
    this.nextSlideIndex = this.currentSlideIndex - 1
    if( this.nextSlideIndex < 0) {
      this.positionLastSlide()
      this.animateSlider(this.nextSlideIndex, 'prev')
    }else{
      this.animateSlider(this.nextSlideIndex, 'prev')
      this.currentSlideIndex = this.nextSlideIndex
    }
  }

  initTriggers(){
    document.querySelector('.js-next').addEventListener('click', ()=> {
      if ( this.isSliding ) {
        console.log('no');
        return
      } else {
        this.isSliding = true
        this.nextSlide()
      }

    } )
    document.querySelector('.js-prev').addEventListener('click', ()=> {
      if ( this.isSliding ) {
        console.log('no');
        return
      } else {
        this.isSliding = true
        this.prevSlide()
      }

    } )
  }

  breakdownSlider(cb) {
    this.isDead = true
    this.slider.style.transform = `translateX(0px)`
    this.inner.style.width = `auto`
    this.inner.style.height = `auto`
    this.elem.style.overflow = `auto`
    this.slider.style.height = `auto`
    this.triggerCallback(cb)

    // breakdown slides
    this.slides.forEach( (slide, i) => {
      slide.style.width = `auto`
      slide.style.position = `relative`
      slide.style.top = `0px`
      slide.style.left = `0px`
    } )
  }

  trigger(eventName, cb) {
    if (eventName === 'destroy') {
      this.breakdownSlider(cb)
    }

    if (eventName === 'generate') {
      this.generateSlider(cb)
    }

    if (eventName === 'next') {
      this.nextSlide()
    }

    if (eventName === 'prev') {
      this.prevSlide()
    }

    if (eventName === 'update') {
      this.generateSlider(cb)
    }
  }

	init() {
    this.parent = this.elem.parentElement
    this.generateSlider()

    if ( this.options.dots ) {
      this.dots = new Dots(this.elem)
    }
    // if()


    window.addEventListener( 'resize', () => {
      if ( ! this.isDead) {
        this.generateSlider()
      }
    } )

    this.initTriggers()
	}
}

export default Slideshow
