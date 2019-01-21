const app = {
	// if image is submitted by url, first ajax call runs.
	// if image is submitted by file, second xmlhttprequest runs.
	getFaceData(image) {
		const endpoint = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=ptrue&returnFaceLandmarks=false&returnFaceAttributes=age,glasses,emotion,hair,makeup'
		const { API_KEY } = config
		if(typeof image === 'string'){
			$.ajax({
				url: endpoint,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Ocp-Apim-Subscription-Key': `${API_KEY}`
				},
				method: 'POST',
				data: `{"url": "${image}"}`,
				error: app.processErr.bind(app)
				}).then((res, status) => {
					if(status === 'success') {
						app.processRes(res)
					}
				})
		} else {
			const xhr = new XMLHttpRequest()
			xhr.onreadystatechange = function (e) {
				if (this.readyState === 4) {
					app.processRes(xhr.response)
				}
			}
			xhr.open('POST', endpoint, true)
			xhr.responseType = 'json'
			xhr.setRequestHeader('Content-Type', 'application/octet-stream')
			xhr.setRequestHeader('Accept', 'application/json')
			xhr.setRequestHeader('Ocp-Apim-Subscription-Key', `${API_KEY}`)
			xhr.send(image)
		}
	},
	
	// process raw res data
	processRes(res) {
		// verify res only had one face submitted to it
		if (res.length === 1) {
			const person1 = res[0]
			this.processEmotions(person1)
			this.processAppearance(person1)
		
		// error handling: res detected more than once face
		} else {
			this.processErr(res)
		}
	},
	
	processErr(res) {
		//$ajax returns an object so it wont have a length 
		if(res.length === undefined) {
			this.renderImgs('./images/upload.png', '‍👨‍💻')
			this.renderMsg(`Error, invalid image`, true)
		}
		
		//xmlhttprequest returns an array.  Its errors are handled below 
		// more than one face detected
		if(res.length > 1) {
			this.renderImgs('./images/upload.png', '👩‍👩‍👧')
			this.renderMsg('Error, please upload an image with a single face', true)
			
		// no face detected
		} else if(res.length < 1) {
			this.renderImgs('./images/upload.png', '🕵️‍')
			this.renderMsg('Error, could not recognize your face', true)
		}
	},
	
	// process emotion data
	processEmotions(person) {
		const emotionObj = person.faceAttributes.emotion
		const emotionArr = Object.values(emotionObj)
		const emotionMaxValue = Math.max.apply(Math, emotionArr)
		
		for(const emotion in emotionObj) {
			if (emotionObj[emotion] === emotionMaxValue) {
				this.selectEmoji(emotion, emotionMaxValue)
				this.renderMsg(`You've got a lot of ${emotion} in you.`, false)
				break
			}  
		}
	},
	
	// process appearance data
	processAppearance({ faceAttributes }) {
		const age = faceAttributes.age
		const makeup = faceAttributes.makeup
		let glasses = ''
		let bald = false
		let hairValArr = []
		let hairColor = ''
		
		if (faceAttributes.glasses !== 'NoGlasses'){
			glasses = faceAttributes.glasses
		}
		if (faceAttributes.hair.bald > 0.5){
			bald = true
		}
		
		for(const value in faceAttributes.hair.hairColor){
			hairValArr.push(faceAttributes.hair.hairColor[value].confidence)
		}
		let hairMaxValue = Math.max.apply(Math, hairValArr)
		
		for (const val in faceAttributes.hair.hairColor) {
			if (faceAttributes.hair.hairColor[val].confidence === hairMaxValue) {
				hairColor = faceAttributes.hair.hairColor[val].color
			}
		}
		this.populateUserAppearance(age, glasses, bald, hairColor, makeup)
	},
	
	selectEmoji(emotion, val) {
			// entire array of emotionMaxValue
			const emotionArr = emojiCodes[emotion]
			// emojiIndex = index number of emoji we want to display
			const emojiIndex = Math.round((emojiCodes[emotion].length -1) * val)
			// actual HTML code for emoji we want to display
			const emojiCode = emotionArr[2]
			this.renderImgs(null, emojiCode)
		},
		
		populateUserAppearance(age, glasses, bald, hairColor, makeup) {
			$('.userAppearance ul').append(`<li><span>Approximate age:</span> ${age} years old.</li>`)
			if(glasses){
				$('.userAppearance ul').append(`<li><span>Glasses:</span> ${glasses}</li>`)
			}
			if(bald){
				$('.userAppearance ul').append(`<li><span>You're bald!</span></li>`)
			} else {
			$('.userAppearance ul').append(`<li><span>Hair color:</span> ${hairColor}</li>`)
			}
			
			if(makeup.eyeMakup){
				$('.userAppearance ul').append(`<li><span>You're wearing eye makeup!</span></li>`)
			}  
			
			if(makeup.lipMakup) {
				$('.userAppearance ul').append(`<li><span>You're wearing lip makeup!</span></li>`)
			} 
		},
	
	prepFileToRender() {
		const file = document.querySelector('input[type=file]').files[0]
		const reader = new FileReader()
		
		reader.addEventListener('load', () => {
			this.renderImgs(reader.result, null)
		}, false)
		if(file){
			reader.readAsDataURL(file)
		}
	},
	
	// ensures both userImg and emoji are available before rendering
	renderImgs: function renderImg(userImg, emoji) {
		if (userImg) {
			renderImg.userImg = userImg
		}
		if (emoji) {
			renderImg.emoji = emoji
		}
		
		if (renderImg.emoji && renderImg.userImg) {
			$('.userEmoji p').html(renderImg.emoji)
			$('#imgDisplay').attr('src', renderImg.userImg)
		
			renderImg.userImg = ""
			renderImg.emoji = ""
		}
	},
	
	renderMsg(msg, isError) {
		if (isError) {
			$('#message').text(msg).css({ color: 'red' })
		} else {
			$('#message').text(msg).css({ color: '#F1F0EB' })
		}
	},
	
	validateForm() {
		const $inputImage = $('.inputImage')
		const userURL = $inputImage.val()
		const valid = $inputImage[0].validity.valid
		
		if(valid && userURL) {
			$inputImage.css({ border: 'none' }).attr('placeholder', 'Paste image URL here!')
			this.getFaceData(userURL)
			this.renderImgs(userURL, null)
		} else {
			$inputImage.css({border: '1px solid red'}).attr('placeholder', 'Please enter a valid URL')
		}
		// empty url input
		$inputImage.val('')
	},
	
	eventListeners() {
		// === url upload listener ===
		$('.inputSubmit').on('click', function(e) {
			e.preventDefault()
			$('.userAppearance ul').empty()
			app.validateForm()
		})
		
		// === file upload listener ===
		$('.inputFile').on('change', function (e) {
			// empty .userAppearance list
			$('.userAppearance ul').empty()
			// extract file to send to API
			let userFile = this.files[0]
			const formData = new FormData()
			formData.append('userFile', userFile)
			// make API call
			app.getFaceData(userFile)
			// prepare file to render
			app.prepFileToRender()
		})
	},
	
	init(){
		this.eventListeners()
	}
}

$(function() {
	app.init()
})
