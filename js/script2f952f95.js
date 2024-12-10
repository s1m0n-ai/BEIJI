const eggs = document.getElementsByClassName('egg')
const eggs_small = document.getElementsByClassName('egg_s')
for (let i = 0; i < eggs.length; i++) {
    eggs[i].addEventListener('click', function (event) {
        const id = eggs[i].getAttribute('data-id')
        const target = document.getElementById(id)
        target.scrollIntoView({
            behavior: 'smooth',
        })
    })
}
for (let i = 0; i < eggs_small.length; i++) {
    eggs_small[i].addEventListener('click', function (event) {
        const id = eggs[i].getAttribute('data-id')
        const target = document.getElementById(id)
        target.scrollIntoView({
            behavior: 'smooth',
        })
    })
}

$('.accordian').click(function () {
    $(this).find('.accordian_body').toggleClass('active')
    $(this).find('.plusminus').toggleClass('active')
    $(this).find('.accordian_header').toggleClass('active')
    $(this).find('.plusbox').toggleClass('active')
})

// document.querySelector('.avatar__avatar img').addEventListener('error', () => {
//     setRandomAvatar()
// })

function setRandomAvatar() {
    const idx = getRandomNumber(0, 4999)
    const imagePath = `/assets/avatars/${idx}.jpeg`

    document.querySelector('.avatar__avatar img').src = imagePath
}

let GENERATING = false

function generateAvatar() {
    if (GENERATING) return
    GENERATING = true

    document.querySelector('.avatar__loading').classList.add('avatar__loading_active')
    setTimeout(setRandomAvatar, 700)
    setTimeout(() => {
        document.querySelector('.avatar__loading').classList.remove('avatar__loading_active')

        GENERATING = false
    }, 2200)
}

function downloadAvatar() {
    const url = document.querySelector('.avatar__avatar img').src

    downloadURI(url, 'peng-avatar.jpeg')
}

function downloadURI(uri, name) {
    const link = document.createElement('a')
    link.download = name
    link.href = uri
    link.click()
    setTimeout(() => {
        link.remove()
    }, 0)
}
function copy() {
    window.navigator.clipboard.writeText($('#numbers').html().trim())
}
function getRandomNumber(min, max) {
    return Math.ceil(Math.random() * (max - min) + min)
}

$(document).ready(function () {
    var uploadArea = $('#upload-area')
    var fileInput = $('#file-input')
    var loader = $('#loader')
    var error = $('#error')
    var result = $('#result')

    fileInput.on('change', function (e) {
        handleFiles(e.target.files)
    })

    uploadArea.on('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
        uploadArea.addClass('dragging')
    })

    uploadArea.on('dragleave', function (e) {
        e.preventDefault()
        e.stopPropagation()
        uploadArea.removeClass('dragging')
    })

    uploadArea.on('drop', function (e) {
        e.preventDefault()
        e.stopPropagation()
        uploadArea.removeClass('dragging')
        var files = e.originalEvent.dataTransfer.files
        handleFiles(files)
    })

    function handleFiles(files) {
        error.text('')
        result.html('')
        var file = files[0]
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
            uploadFile(file)
        } else {
            error.text('Invalid file type. Please upload an image (jpg, jpeg, png, webp).')
        }
    }

    function uploadFile(file) {
        var formData = new FormData()
        formData.append('file', file)

        loader.show()

        $.ajax({
            url: 'https://api.baaaack.com/process-image/', // Change this URL to your actual endpoint
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            xhrFields: {
                responseType: 'blob', // This tells jQuery to expect a binary response from the server
            },
            success: function (response) {
                loader.hide()

                var blob = response instanceof Blob ? response : new Blob([response])

                var reader = new FileReader()
                reader.onload = function (e) {
                    var image = new Image()
                    image.src = e.target.result

                    result.append(image)

                    var img = $('<img>').attr('src', e.target.result)
                    var btn = $('<a>').attr('href', e.target.result).attr('download', 'output.png').text('Download').addClass('btn btn-primary btn-primary11')
                    var br = $('<br>')
                    // result.html(img)

                    // result.html(img)
                    result.append(br)
                    result.append(btn)
                }
                reader.readAsDataURL(blob)
            },
            error: function (jqXHR) {
                loader.hide()
                error.text('There was an error uploading your file. No face detected in the image. Try again with an other one.')
            },
        })
    }
})
