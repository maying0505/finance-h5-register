function createIFrame (item, triggerDelay, removeDelay) {
    setTimeout(() => {
        var iFrame = document.createElement('iframe');
        iFrame.style.display = 'none';
        iFrame.src = item.downloadUrl;
        document.body.appendChild(iFrame);
        setTimeout(() => {
            document.body.removeChild(iFrame);
        }, removeDelay);
    }, triggerDelay);
}
function DownloadFile (downloadUrl) {
    console.log(downloadUrl)
    var triggerDelay = 100;
    var removeDelay = 3000;
    if (!downloadUrl) {
        return;
    }
    var item = {downloadUrl};
    createIFrame(item, triggerDelay, removeDelay);
}
