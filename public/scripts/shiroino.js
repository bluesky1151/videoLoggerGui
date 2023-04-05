const target = "https://asogi.f5.si:3007/db/regist";

const nowurl = location.href;
const splt = nowurl.split('/');

if(4 <= splt.length) {
    const title = document.title;
    $.post(target, {
        title,
        url: nowurl,
        site: 1,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
}

function getImageURL(){
    let img = document.querySelector('img.thm');
    console.log(img);
    return img.src;
}