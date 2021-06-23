const download = require("node-hls-downloader").download;

const link = process.env.link;
//ex.https://d1m7jfoe9zdc1j.cloudfront.net/e666d04affe8bf5b0147_bbaktube_42367451261_1623657470/storyboards/1055780298-strip-0.jpg

const string = process.env.string;
//91

var changed_link = link.substring(0,string) + "chunked/index-dvr.m3u8";
//final link: https://d1m7jfoe9zdc1j.cloudfront.net/e666d04affe8bf5b0147_bbaktube_42367451261_1623657470/chunked/index-dvr.m3u8
console.log("received link is " + changed_link);

//문자열 길이 측정
//console.log(`${link.length}`);

const name = process.env.name;
//ex.20210617BBAK
const changed_name = name + ".mp4"
console.log("received file name is " + changed_name);

 // \ffmpeg -headers "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36" -i "주소" -c copy -bsf:a aac_adtstoasc "파일명.mp4"
async function asyncCall(){
  await download({
  quality: "best",
  concurrency: 4,
  // httpHeaders: "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36",
  outputFile: changed_name,
  streamUrl: changed_link,
  });
  console.log("complete");
}

asyncCall();

// docker run -v ${PWD}:/usr/src/app -i --rm --name app -e string 91 -e link=https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/storyboards/1003549824-strip-0.jpg -e name=BBAK app