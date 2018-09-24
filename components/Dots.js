class Dots {
	constructor(parent, slides) {
		this.parent = parent
    this.slides = slides
    this.init()
    this.dots
	}

  triggerSlideUpdateEvent(updateIndex) {
    let eventPayload = {
      detail:{
        updateIndex: updateIndex
      }
    }

    let slideUpdate = new CustomEvent('slideUpdate', eventPayload);
    this.parent.dispatchEvent(slideUpdate)
  }

  addDots() {
    let dots = ``
    this.slides.map( (slide, index)=> {
      let active = ''
      if(index === 0){
        active = '_is-active'
      }
      let dot = `
        <li class="${active}">
          <button>${index}</button>
        </li>
      `

      dots = dots + dot
    } )

    return dots
  }

  generateDots() {
    let dotList = `
      <div class="dots">
        <ul class="dots__list">
          ${ this.addDots() }
        </ul>
      </div>
    `

    this.parent.insertAdjacentHTML( 'beforeend', dotList );
    this.dots = [...this.parent.querySelectorAll('.dots__list li')]
  }

  updateActive(updateIndex) {
    this.dots.forEach( (slide, slideIndex) => {
      if ( slideIndex === updateIndex ) {
        slide.classList.add('_is-active')
      } else {
        slide.classList.remove('_is-active')
      }
    } )
  }

  dotListener() {
    this.parent.addEventListener('updateEvent', (event) => {
      let index = event.detail.updateIndex

      if ( index > this.slides.length - 1 ) {
        index = 0
      }

      if ( index < 0 ) {
        index = this.slides.length - 1
      }

      this.updateActive( index )
    })

    this.dots.forEach( (dot, i) => {
      dot.addEventListener('click', ()=> {
        console.log('click');
        this.triggerSlideUpdateEvent(i)
      })
    } )
  }

	init() {
    this.generateDots()
    this.dotListener()
	}
}

export default Dots
