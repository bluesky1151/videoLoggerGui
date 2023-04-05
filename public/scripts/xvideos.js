const target = "https://asogi.f5.si:3007/db/regist";
let nowurl = location.href;
let splittedUrl = nowurl.split("/");

console.log(splittedUrl)

getImageURL();
if(4 < splittedUrl.length){
    let title = document.getElementById('title-auto-tr') || document.getElementsByClassName('page-title');
    title = title[0] ? title[0].innerText : title.innerText;
    $.post(target, {
        title,
        url: nowurl,
        site: 5,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
}

function getImageURL(){
    const doc = document.getElementsByClassName('video-pic');
    const img = $(doc).children().find('img').prevObject[0];
    // console.log(img.src);
    return img.src;
}