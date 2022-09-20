var serverHost, stringifyJs;

fetch('https://remotehostsmiley.000webhostapp.com/getServer.json')
.then(response => response.json())
.then(json => {
    stringifyJs = JSON.stringify(json)
    stringifyJs = stringifyJs.split(':"')
    stringifyJs = stringifyJs[1];
    stringifyJs = stringifyJs.slice(0, stringifyJs.length - 2)
    console.log(stringifyJs)
    serverHost = stringifyJs;
})

// const socket = io("http://localhost:3000")
const socket = io(serverHost);
console.log(serverHost)

var image = document.querySelectorAll('img');
var origImage = [];
var bod;
var allDivs;
var shaker = false;
var textHack = false;


for (i = 0; i < image.length; i++) {
    origImage[i] = image[i].src;
}

socket.on('greet', data=> {
    console.log(data);
})

socket.on('smile', () => {
    console.log("evil smile")
    image = document.querySelectorAll('img');
    for (i = 0; i < image.length; i++) {
        image[i].src = "https://i.pinimg.com/originals/25/13/b5/2513b578aaf1b57df5dd0256274c5ff7.jpg"
    };
})

socket.on("normal", ()=>{
    console.log("normal")
    for (i = 0; i < image.length; i++) {
        image[i].src = origImage[i];
    };
    shaker = false;
    textHack = false;

})

socket.on("shake", ()=>{
    shaker = true;
    setInterval(() => {
    if(shaker){
        bod = document.querySelector('body');
        bod.style.backgroundColor = "black";;
        allDivs = document.querySelectorAll('div');
        for (var i = 0; i < allDivs.length; i++) {
            allDivs[i].style['background-color'] = 'black';
            allDivs[i].style['color'] = 'green';
            allDivs[i].style['font-family'] = 'Monospace';
        };
        Array.prototype.slice.call(document.querySelectorAll('div,p,span,img,a,body')).map(function(tag) {
            tag.style['transform'] = 'rotate(' + (Math.floor(Math.random() * 3) - 1) + 'deg)';
        });
    } },10);
    
})

socket.on("text", data=>{
    var TEXT = data;
    textHack = true;
    
    Array.prototype.slice.call(document.querySelectorAll(`input[type=text],textarea`)).map(function(el) {
        el.onkeypress = function(evt) {
            var charCode = typeof evt.which == `number` ? evt.which : evt.keyCode;
            if (charCode && charCode > 31) {
                var start = this.selectionStart,
                    end = this.selectionEnd;
                if(textHack){
                    this.value = this.value.slice(0, start) + TEXT[start % TEXT.length] + this.value.slice(end);
                    this.selectionStart = this.selectionEnd = start + 1;
                } else {
                    this.value = this.value.slice(0, start) + String.fromCharCode(charCode) + this.value.slice(end);
                    this.selectionStart = this.selectionEnd = start + 1;
                }
            }
            return false;
        }
    });
    
    
})
