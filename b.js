var express = require('express');
var app = express();
var fs = require('fs');


app.get('/',function(req,res){ 
    res.sendFile('/home/taeugi323/Capstone/work1/');
    console.log("accessed - "+req.ip);
});

app.get('/transmit',function(req,res){  // Getting informations from the query and write them on log file
    var user_data = {};
    user_data['data'] = req.query.pattern;
    user_data['browser'] = req.headers['user-agent'];
    user_data['ip'] = req.ip;
    //user_data['cookie'] = req.cookies.name;
    var dt = new Date();
    user_data['time'] = dt.toString();
    
    fs.appendFile("/home/taeugi323/Capstone/work1/log.txt",JSON.stringify(user_data)+'\n',function(err){});
    res.redirect('/');
});

app.get('/reg',function(req,res){   // Showing logs
    res.sendFile('/home/taeugi323/Capstone/work1/log.txt');
});

app.get('/log',function(req,res){   // Getting input as a regular expression format
    res.sendFile('/home/taeugi323/Capstone/work1/log/log_index.html');
});

app.get('/regex',function(req,res){     // Searching the data based on the above input
    fs.readFile('/home/taeugi323/Capstone/work1/log.txt','utf-8',function(err,data){
        if(err){
            return console.log(err);
        }
        else if(data.match(req.query.reg)){
            var reg_format = new RegExp(req.query.reg,'g'); // Changing input string to reg_ex format
                                                            // Parameter 'g' for all matching string
            var data_before = data.match(reg_format);
            var data_after = new String();

            for(var i=0;i<Object.keys(data_before).length;i++){
                data_after += (data_before[i]+'\n');
            }
            res.setHeader('Content-Type','application/json');
            res.send(data_after);
        }
        else{
            res.send("No match!");
        }
    });
});

app.use('/static', express.static('/home/taeugi323/Capstone/work1/')); // To use directory's data in web server

app.listen(2323, function(){}); // Running web server in port 2323

