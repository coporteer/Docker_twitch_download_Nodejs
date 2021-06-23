## 목차

- [목차](#목차)
- [빠른_시작](#빠른_시작)
  - [결과](#결과)
- [주의할_점](#주의할_점)
- [참고한_자료들](#참고한_자료들)

## 빠른_시작

```javascript
/*
이 코드는 트위치 다시보기를 저장하기위한 코드입니다. 필자가 일하는 곳이 인터넷이 불안정하다보니 모니터 해상도대비 부족한 화질로 방송 다시보기를 보기에는 힘든 점이 많았습니다. 
그런 점을 개선하고자 지난 방송을 저장할 수 있도록 코딩을 하고 쉽고 빠르게 작동시킬 수 있도록 Docker로 만들었습니다. 저장할 다시보기의 이미지 링크를 바탕으로 현재 디렉토리에 다시보기 MP4 파일을 저장합니다.
필자의 코딩실력 부족으로 인해 /storyboards까지 자동으로 편집하는 코드는 만들지 못했습니다. 그래서 유저가 /storyboard 앞 숫자까지의 string 수를 변수로 같이 입력해줘야합니다. 
string 수는 글자수 세기 사이트(ex. https://www.saramin.co.kr/zf_user/tools/character-counter) 등을 이용해서 계산하면됩니다.

-e string = /storyboard 앞까지의 글자 수
-e link = 저장할 다시보기의 썸내일 이미지 주소
-e name = 저정할 파일의 이름(*확장자 포함 필요없음*)
-e thread = 사용할 쓰레드의 수

예시:

docker run -v ${PWD}:/usr/src/app -i --rm --name app -e thread=4 -e string=91 -e link=https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/storyboards/1003549824-strip-0.jpg -e name=BBAK2021 swoho0325/twitch-download
*/
```

```bash
docker pull swoho0325/twitch-download

docker run -v ${PWD}:/usr/src/app -i --rm --name app -e thread=4 -e string=91 -e link=https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/storyboards/1003549824-strip-0.jpg -e name=BBAK2021 swoho0325/twitch-download
```

1. 원하는 다시보기 방송의 썸네일 링크를 복사합니다.
2. 복사한 링크에서 /storyboard부터 뒤를 모두 지웁니다.
3. 지운 링크의 글자수를 구합니다. [사람인 글자수 세기 링크](https://www.saramin.co.kr/zf_user/tools/character-counter)
4. Docker 명령어로 사용할 쓰레드 수, 사이트에서 구한 편집된 링크의 글자수, 다운로드할 다시보기의 원래 링크, 저장할 파일 이름을 입력합니다.  

### 결과

```powershell
target link is : https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/chunked/index-dvr.m3u8
File name is : BBAK2021.mp4
Queueing 211 segment(s)
Received: https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/chunked/0.ts
(0~211 조각을 다운로드 시도-너무 길어져 생략함)
Received: https://d2nvs31859zcd8.cloudfront.net/058492dd4ece5e3f9cb2_bbaktube_42450100382_1619590815/chunked/211.ts
All segments received, stopping
Spawning FFMPEG ffmpeg -y -loglevel warning -i /tmp/hls-downloader/1624414273697.ts -c copy -bsf:a aac_adtstoasc BBAK2021.mp4
Complete

```

## 주의할_점

1. 이미 /storyboard의 뒤를 지운 링크를 만들었는데, 그대로 붙여넣기해서 사용하지 왜 글자수를 세서 입력하는 과정이 필요없다고 생각하실 수 있습니다. 저도 처음에는 그대로 편집한 링크를 넣는 방식으로 했는데 2개,3개 다운로드 할때부터 링크를 편집하고 복사하기에 너무 시간이 많이 들었고, 같은 트위치 스트리머내의 다시보기의 글자수 갯수는 모두 일치하기에 한번 글자수 세는 것이 2개이상의 다시보기 다운로드에는 더 효율적이라 생각하고 여러 영상을 다운로드 한다는 것에 좀 더 초점을 맞춰서 글자수 + 원본링크로 변수를 구성하게 되었습니다.
2. *반드시* 다시보기의 썸네일 링크를 복사해야합니다! [예시](https://d1m7jfoe9zdc1j.cloudfront.net/e666d04affe8bf5b0147_bbaktube_42367451261_1623657470/storyboards/1055780298-strip-0.jpg)
3. 만약에 ffmpeg 관련한 오류가 뜬다면 Dockerfile에 다음처럼 적혀있도록 해야합니다!

```dockerfile
COPY --from=mwader/static-ffmpeg:4.4.0 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /ffprobe /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.4.0 /qt-faststart /usr/local/bin/
```

4. PowerShell에 결과 창 복사시 ``` 명령어 | clip```을 사용한다면 콘솔창에 찍히는 게 없는 것이 정상입니다!

## 참고한_자료들

1. https://meonol.tistory.com/97
2. https://hub.docker.com/r/mwader/static-ffmpeg/
3. https://github.com/wader/static-ffmpeg
4. https://stackoverflow.com/questions/50693091/ffmpeg-install-within-existing-node-js-docker-image
5. https://www.npmjs.com/package/m3u8-to-mp4
6. https://www.npmjs.com/package/ffmpeg-static
7. https://uaremine.tistory.com/11
8. https://svrstudy.tistory.com/62