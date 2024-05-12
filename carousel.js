class Carousel {
  constructor(params) {
    const config = this._initConfig(params)

    this.container = document.querySelector(config.containerId)
    this.slideItems = this.container.querySelectorAll(config.slideId)
    this.interval = config.interval  
    this.isPlaying = config.isPlaying
  }
  
  _initConfig (objectWithInitParams) {
    const defaultSettings = {
      containerId: '#carousel',
      slideId: '.slide',
      interval: 2000,
      isPlaying: true,
    }

    const resultObject = {...defaultSettings,...objectWithInitParams}

    return resultObject 
  }
  
  _initProps () {    
    this.SLIDES_COUNT = this.slideItems.length
    this.CODE_SPACE = 'Space'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>'
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>'

    this.currentSlide = 0    
  }

  _initIndicators () {
    const indicators = document.createElement('div')

    indicators.setAttribute('class', 'indicators')
    indicators.setAttribute('id', 'indicators-container')

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div')
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active') 
      indicator.dataset.slideTo = '${i}'

      indicators.append(indicator)     
    }

    this.container.append(indicators)

    this.indicatorsContainer = this.container.querySelector('#indicators-container')
    this.indicatorItems = this.indicatorsContainer.querySelectorAll('.indicator')
  }

  _initControls () {
    const controls = document.createElement('div')
    const PREV = '<span class="button button-prev" id="prev-btn"><i class="fas fa-angle-left"></i></span>'
    const PAUSE = `<span class="button button-pause" id="pause-btn">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</i></span>`
    const NEXT = '<span class="button button-next" id="next-btn"><i class="fas fa-angle-right"></i></span>'

    controls.setAttribute('class', 'buttons')
    controls.setAttribute('id', 'buttons-container')
    controls.innerHTML = PREV + PAUSE + NEXT
    
    this.container.append(controls)     
    this.pauseBtn = this.container.querySelector('#pause-btn')
    this.nextBtn = this.container.querySelector('#next-btn')
    this.prevBtn = this.container.querySelector('#prev-btn')
  }

  _initListeners () {
    document.addEventListener('keydown', this._pressKeyHandler.bind(this))
    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this))
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this))
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))       
    this.slidesContainer.addEventListener('mouseenter', this.pauseHandler.bind(this))
    this.slidesContainer.addEventListener('mouseleave', this.playHandler.bind(this))
  }

  _gotoNth(n) {
      this.slideItems[this.currentSlide].classList.toggle('active')
      this.indicatorItems[this.currentSlide].classList.toggle('active')
      this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
      this.slideItems[this.currentSlide].classList.toggle('active')
      this.indicatorItems[this.currentSlide].classList.toggle('active')
  }
    
  _gotoNext() {  
    this._gotoNth(this.currentSlide + 1)
  }
    
  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1)
  }

  _indicateHandler(e) {
    const target = e.target
    if (target.classList.contains('indicator')) {
      this.pauseHandler()
      this._gotoNth(+target.dataset.slideTo)
    }
  }
  
  _pressKeyHandler(e) {
    const code = e.code
    if (code === this.CODE_SPACE) this.pausePlayHandler()
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler()
    if (code === this.CODE_ARROW_LEFT) this.prevHandler()
  }
    
  _tick() {
    if (!this.isPlaying) return
    this.timerId = setInterval(() => this._gotoNext(), this.interval)
  }

  pauseHandler() {
    if (!this.isPlaying) return
    this.isPlaying = false
    clearInterval(this.timerId)
    this.pauseBtn.innerHTML = this.FA_PLAY
  }   
    
  playHandler() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.pauseBtn.innerHTML = this.FA_PAUSE
    this._tick()
  }
    
  pausePlayHandler () {
    if (this.isPlaying) {
      this.pauseHandler()
      } else {
      this.playHandler()
      }
  }
    
  nextHandler () {
    this.pauseHandler()
    this._gotoNext()
  }
    
  prevHandler () {
    this.pauseHandler()
    this._gotoPrev()
  }
    
  init() {
    this._initConfig()
    this._initProps()
    this._initControls()
    this._initIndicators()
    this._initListeners()
    this._tick()
  }
}

export default Carousel  
