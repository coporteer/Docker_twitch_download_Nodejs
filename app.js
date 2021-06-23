/*
이 코드는 트위치 다시보기를 저장하기위한 코드입니다. 필자가 일하는 곳이 인터넷이 불안정하다보니 모니터 해상도대비 부족한 화질로 방송 다시보기를 보기에는 힘든 점이 많았습니다. 
그런 점을 개선하고자 지난 방송을 저장할 수 있도록 코딩을 하고 쉽고 빠르게 작동시킬 수 있도록 Docker로 만들었습니다. 저장할 다시보기의 이미지 링크를 바탕으로 현재 디렉토리에 다시보기 MP4 파일을 저장합니다.
필자의 코딩실력 부족으로 인해 /storyboards까지 자동으로 편집하는 코드는 만들지 못했습니다. 그래서 유저가 /storyboard 앞 숫자까지의 string 수를 변수로 같이 입력해줘야합니다. 
string 수는 글자수 세기 사이트(ex. https://www.saramin.co.kr/zf_user/tools/character-counter) 등을 이용해서 계산하면됩니다.

-e string = /storyboard 앞까지의 string 수
-e link = 저장할 다시보기의 썸내일 이미지 주소
-e name = 저정할 파일의 이름(MP4)
-e thread = 사용할 쓰레드의 수

예시:

docker run -v ${PWD}:/usr/src/app -i --rm --name app -e thread=4 -e string=91 -e link=https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/storyboards/1003549824-strip-0.jpg -e name=BBAK2021 swoho0325/twitch-download
*/

const download = require("node-hls-downloader").download;

//Docker에서 변수 받아오기
const link = process.env.link;
//ex.https://d1m7jfoe9zdc1j.cloudfront.net/e666d04affe8bf5b0147_bbaktube_42367451261_1623657470/storyboards/1055780298-strip-0.jpg
const string = process.env.string;
//ex.91
const name = process.env.name;
//ex.20210617BBAK
var thread = parseInt(process.env.thread);
//ex.4

//ffmpeg에 맞게 변수 가공
var changed_link = link.substring(0,string) + "chunked/index-dvr.m3u8";
console.log("target link is : " + changed_link);
//target link is : https://d1m7jfoe9zdc1j.cloudfront.net/e666d04affe8bf5b0147_bbaktube_42367451261_1623657470/chunked/index-dvr.m3u8

const changed_name = name + ".mp4"
console.log("File name is : " + changed_name);
//File name is : 20210617BBAK.mp4
 
// Await를 이용해 다운로드가 다 끝날때까지 기다리고 컨테이너를 완료함.
// 필자 컴퓨터(i5-7500T)로 4쓰레드, 2쓰레드 해보았는데, 쓰레드 수보다는 인터넷 속도가 다운속도에 더 큰 영향을 주는 것 같다. 더 많은 쓰레드를 쓰고 싶다면 concurrency를 올리면된다.
async function asyncCapture(){
  await download({
  quality: "best",
  concurrency: thread,
  // httpHeaders: "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36",
  outputFile: changed_name,
  streamUrl: changed_link,
  });

  console.log("Complete");
}

asyncCapture();