//SpankBang
const target = "https://asogi.f5.si:3007/db/regist";

const nowurl = location.href;
// const splt = nowurl.split('/');

let reg = /video-.+/
let url = nowurl.match(reg)

if(isset(url)) {
    //動画
    // alert('input')
    // const title = document.getElementById('container').getElementsByTagName('h1')[0].innerText;
    let splt = nowurl.split('/');
    splt[4] = "_";

    let url_ = splt.slice(0, 5);
    $.post(target, {
        title: document.title,
        url: url_.join('/'),
        site: 4,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
}
function getImageURL(){
    let div = document.getElementsByClassName('video-pic');
    let img = div[0].getElementsByTagName('img');

    return img[0].src;
}

function isset(data){
    if(data == null || data == undefined){
        return false;
    }else{
        return true;
    }
}