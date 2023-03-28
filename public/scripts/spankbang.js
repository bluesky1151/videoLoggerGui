//SpankBang
const target = "https://asogi.f5.si:3007/db/regist";

const nowurl = location.href;
const splt = nowurl.split('/');

if(splt.length >= 5) {
    //動画
    // alert('input')
    const title = document.getElementById('container').getElementsByTagName('h1')[0].innerText;
    $.post(target, {
        title,
        url: nowurl,
        image: getImageURL()
    }, (data) => {
        console.log(data);
    })
    // $.ajax({
    //     url: target,
    //     type: "post",
    //     processData: false,
    //     dataType: "json",
    //     data: {
    //         title,
    //         url: nowurl,
    //         image: getImageURL()
    //     },
    // }).done((data) => {
    //     alert(data);
    // }).fail(err => console.log(err));
}
function getImageURL(){
    let div = document.getElementById('player_wrapper_outer');
    let images = div.getElementsByTagName('img');
    return images[0].src;
}