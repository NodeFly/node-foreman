var fs   = require('fs')
var cons = require('./console').Console

// Parse Procfile
function procs(procdata){

    var processes = {};

    procdata.toString().split(/\n/).forEach(function(line){
        if(line=='') return;
        
        var tuple = /^([A-Za-z0-9_]+):\s*(.+)$/m.exec(line);

        var prockey = tuple[1].trim();
        var command = tuple[2].trim();
        
        if(prockey=='')
            return cons.Warn('Syntax Error in Procfile, Line %d: No Prockey Found',i+1);
        
        if(command=='')
            return cons.Warn('Syntax Error in Procfile, Line %d: No Command Found',i+1);
        
        var comm = command.split(/\s/);
        var args = comm.splice(1,comm.length);
        
        var process = {
            command : comm[0],
            args    : args
        };
		
        processes[prockey]=process;

    });

    return processes;
}

// Look for a Procfile at the Specified Location
function loadProc(path){
    
    try{
        var data = fs.readFileSync(path);
        return procs(data);
    }catch(e){
		cons.Warn('No Procfile Found')
        if(fs.existsSync('package.json')){
            cons.Alert("package.json file found - trying 'npm start'")
            return procs("web: npm start");
        }else{
            cons.Error("No Procfile found in Current Directory - See nf --help");
            return;
        }
    }

}

module.exports.loadProc = loadProc
module.exports.procs    = procs
