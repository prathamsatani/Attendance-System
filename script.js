const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const photo = document.getElementById('photo');
const cameraSelect = document.getElementById('camera-select');

function getAvailableCameras() {
    return navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            return devices.filter(device => device.kind === 'videoinput');
        });
}

function startVideo(deviceId) {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

getAvailableCameras()
    .then(devices => {
        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || 'Camera ' + device.deviceId;
            cameraSelect.appendChild(option);
        });
    });

cameraSelect.addEventListener('change', () => {
    const selectedDeviceId = cameraSelect.value;
    startVideo(selectedDeviceId);
});

// Start with the first camera if available
cameraSelect.addEventListener('change', () => {
    if (cameraSelect.value) {
        startVideo(cameraSelect.value);
    }
});

captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg');
    photo.src = dataURL;
    photo.style.display = 'block';
});


