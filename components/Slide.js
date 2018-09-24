class Slide {
	constructor( elem, id ) {
		this.elem = elem
    this.id = id
    this.position = id
    this.init()
	}

  setSlideData(){
    this.elem.dataset.id = this.id
  }

  updatePosition( position ) {
    this.position = position
  }

	init() {
    console.log(`${this.id} init`);
    this.setSlideData()
	}
}

export default Slide
