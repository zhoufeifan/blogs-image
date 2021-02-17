const http = require("http");
const crypto = require('crypto');
const Path = require("path");
const fs = require("fs");

// todo 添加gzip压缩
// todo 缓存控制
const server = http.createServer(function (req,res){
    const fileName = Path.resolve(__dirname,"."+req.url);
    const extName = Path.extname(fileName).substr(1);
    // res.setHeader('Cache-Control', 'max-age=20')
    const buffer = fs.readFileSync(fileName);
    const hash = crypto.createHash('md5').update(buffer, 'utf8').digest('hex');
    res.setHeader('Cache-Control', 'max-age=300')
    res.setHeader('Etag', hash)
    // res.setHeader('last-modified', new Date().toUTCString())
    // if (new Date(req.headers['if-modified-since']).getTime() + 30 * 1000 > Date.now()) {
    //     console.log('协商缓存命中....')
    //     res.statusCode = 304
    //     res.end()
    //     return
    // }
    if(req.headers['if-none-match'] === hash){
        console.log('Etag协商缓存命中.....')
        res.statusCode = 304
        res.end()
        return 
      }
    if (fs.existsSync(fileName)) { //判断本地文件是否存在
        var mineTypeMap={
            html:'text/html;charset=utf-8',
            htm:'text/html;charset=utf-8',
            xml:"text/xml;charset=utf-8",
            png:"image/png",
            jpg:"image/jpeg",
            jpeg:"image/jpeg",
            gif:"image/gif",
            css:"text/css;charset=utf-8",
            txt:"text/plain;charset=utf-8",
            mp3:"audio/mpeg",
            mp4:"video/mp4",
            ico:"image/x-icon",
            tif:"image/tiff",
            svg:"image/svg+xml",
            zip:"application/zip",
            ttf:"font/ttf",
            woff:"font/woff",
            woff2:"font/woff2",
        }
        if (mineTypeMap[extName]) {
            res.setHeader('Content-Type', mineTypeMap[extName]);
        }
        var stream = fs.createReadStream(fileName);
        stream.pipe(res);
    }

    
})
server.listen(8080, ()=>{
    console.log('starting at http://localhost:8080')
});
