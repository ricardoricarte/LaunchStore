const Mask = {
  apply(input, func) {
    setTimeout(function(){
        // = Mask.formatBRL, ou qualquer outra função dentro de Mask
        input.value = Mask[func](input.value) 
        //Após  1 ms, a função pega o value do input e executa a função formatBR
    }, 1)
  },
  formatBRL(value) {
    value = value.replace(/\D/g,"")

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', //1.000.00
      currency: 'BRL'
    }).format(value/100)
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g,"")

    if (value.length > 14)
      value = value.slice(0,-1) //Tira a ultima posição

    // Checar pra ver se  CNPJ - 11.222.333/0001-11
    if (value.length > 11) {
        value = value.replace(/(\d{2})(\d)/, "$1.$2") // 11.222333444455

        value = value.replace(/(\d{3})(\d)/, "$1.$2") //11.222.333444455

        value = value.replace(/(\d{3})(\d)/, "$1/$2") //11.222.333/444455

        value = value.replace(/(\d{4})(\d)/, "$1-$2") //11.222.333/4444-55

    } else { 
      // cpf 111.222.333-44
      value = value.replace(/(\d{3})(\d)/, "$1.$2") 

      value = value.replace(/(\d{3})(\d)/, "$1.$2") 

      value = value.replace(/(\d{3})(\d)/, "$1-$2") 

    } 

    return value
  },
  cep(value) {
    value = value.replace(/\D/g,"")

    if (value.length > 8)
      value = value.slice(0,-1) //Tira a ultima posição

    value = value.replace(/(\d{5})(\d)/, "$1-$2") 

    return value
  }
}

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target
    
    if (PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      
      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => { //Quando o arquivo estiver pronto, executa a arrow function
        const image = new Image()
        image.src = String(reader.result)
        

        const div = PhotosUpload.getContainer(image)

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file) // Quando carregado, executa a função onload
    })

   PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input 

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo")
          photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos!")
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles(){
    const dataTranfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTranfer.items.add(file))

    return dataTranfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')
        div.classList.add('photo') //Adiciona a classe 'photo' na div

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')

    button.innerHTML = "close"

    return button

  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode // event.target = <i> , parent node div "photo"
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode


    //Remove as fotos do front e coloca no array removedFiles
    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},` //1,2,3 (IDs)
      }
    }


    photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'), //Primeira Imagem
  previews: document.querySelectorAll('.gallery-preview img'), //Pega todas as imagens
  setImage(e) {
      const { target } = e

      ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
      target.classList.add('active')

      ImageGallery.highlight.src = target.src
      Lightbox.image.src = target.src
     
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButtom: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButtom.style.top = 0
  },
  close(){
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = "initial"
    Lightbox.closeButtom.style.top = "-80px"
  }
}

const Validate = {
  apply(input, func ) {
      Validate.clearErrors(input)

      let results = Validate[func](input.value)
      input.value = results.value

      if (results.error) {
        Validate.displayError(input, results.error)
      }  
  },
  displayError(input, error) {
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus() 
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error')
    if (errorDiv)
      errorDiv.remove()
  },
  isEmail(value) {
    let error = null
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(mailFormat))
      error = "Email inválido"
    return {
      error,
      value
    }
  },
  isCpfCnpj(value) {
    let error = null

    const cleanValues = value.replace(/\D/g,"")

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "CPNJ incorreto"
    }
    else if (cleanValues.length < 12 && cleanValues.length !== 11) {
      error = "CPF incorreto"
    }

    return {
      error,
      value
    }
  },
  isCep(value) {
    let error = null

    const cleanValues = value.replace(/\D/g,"")

    if (cleanValues.length !== 8) {
      error = "CEP incorreto"
    }

    return {
      error,
      value
    }
  },
  allFields(e) {
    const items = document.querySelectorAll(' .item input, .item select, .item textarea')

    for (item of items) {
      if(item.value == "") {
        const message = document.createElement('div')
        message.classList.add('messages')
        message.classList.add('error')
        message.style.position = 'fixed'
        message.innerHTML = 'Todos os campos são obrigatórios.'
        document.querySelector('body').append(message)

        e.preventDefault() // Bloqueia a página, não deixando ir para 'frente'.

      }
    }
  }
}