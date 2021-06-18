
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream)
        // We have to create or convert it to a url in order to make video recorder understand what we do
            
        //  DEPRECIATION : 
        //       The following has been depreceated by major browsers as of Chrome and Firefox.
        //       video.src = window.URL.createObjectURL(localMediaStream);
        //       Please refer to these:
        //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
        //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
        
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error('OOH NO0O0O!!!', err)
    })

}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
    
       pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.5;
    
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 50);
}

function takePhoto()
{
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    console.log(data)
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','cool')
    //link.textContent = 'Download image';
    link.innerHTML = `<img src="${link.href}" alt="cooooooool man"/>`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
  }
  
  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }
getVideo();

video.addEventListener('canplay', paintToCanvas)
