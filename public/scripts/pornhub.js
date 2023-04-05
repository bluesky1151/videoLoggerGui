const target = "https://asogi.f5.si:3007/db/regist";

const nowurl = location.href;
const splt = nowurl.split('/');

if(3 < splt.length) {
    const title = document.title;
    $.post(target, {
        title,
        site: 0,
        url: nowurl,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
}

function getImageURL(){
    let img = document.getElementById('videoElementPoster');
    console.log(img.src);
    return img.src;
}