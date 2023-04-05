const target = "https://asogi.f5.si:3007/db/regist";

const nowurl = location.href;
const splt = nowurl.split('/');

if(splt[3] == "video" && splt[4]) {
    // const title = $('#contents').children('h1')[0].text();
    $.post(target, {
        title: getName,
        url: nowurl,
        site: 3,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
}

function getImageURL(){
    const urlRe = /https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+/;
    const posterImage = document.getElementsByClassName('posterImage');
    //console.log(posterImage);
    const style = posterImage[0].getAttribute('style');
    //console.log(style);
    const result = style.match(urlRe);
    //console.log(result);
    return result[0];
}

function getName(){
    const hoge = $('#contents').children('h1');
    //console.log($(hoge[0]).text());
    return $(hoge[0]).text();
}