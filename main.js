
let canvas;
let ctx; //이미지를 그려줄 변수

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

//캠버스의 사이즈 지정
canvas.width = 400;
canvas.height = 700;

//캠버스를 html에 넣어주기
document.body.appendChild(canvas)

//============= ▲ 캠버스 세팅 ================

//변수 세팅
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

let gameOver = false; // true이면 게임이 끝남, fulse이면 게임이 안끝남

let score = 0 //점수판

//우주선 좌표 (왜 따로 빼놓냐? 우주선은 계속 움직일 것 이기 때문에)
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

//총알들을 저장하는 리스트
let bulletList = []

//총알 만들기
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 18;
        this.y = spaceshipY;

        this.alive = true; //true면 살아있는 총알 false는 죽은 총알

        bulletList.push(this);
    };

    //총알이 위로 발사
    this.update = function() {
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x
                && this.x <= enemyList[i].x + 32){
                    //총알이 죽게됨 적군의 우주선이 없어짐, 점수 휙득
                    score++;
                    this.alive = false; //죽은 총알

                    enemyList.splice(i, 1);
                }
        }
        
    }
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random() * (max-min+1))+min
    return randomNum
}

let enemyList = []
//적군 만들기
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-42);

        enemyList.push(this);
    }
    this.update = function(){
        this.y += 3; //적군의 속도 조절
        
        //적군이 바닥에 닿으면 gameover
        if(this.y >= canvas.height-42){
            gameOver = true;
            console.log("gameover");
        }
    }
}

//이미지를 불러오는 함수
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.gif"

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png"
}

//이미지를 캠버스에 보여주는 함수
function render(){
    //CanvasRenderingContext2D.drawImage(image, dx, dy, dWidth, dHeight)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    //점수 보여주는
    ctx.fillText(`Score : ${score}`, 15, 30);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

//화면에 계속 호출하기 위해 만든 함수
function main(){

    if(!gameOver){
        update(); //좌표값을 업데이트하고
        render(); //그려주고
        // console.log("animation calls main function") 
        // ↑화면에 계속 호출하는 것을 콘솔창에서 확인할 수 있다.
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage, 30, 170, 340, 270);
    }

}


//1. 방향키를 누르면
let keysDown={}

function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        // console.log("무슨 키가 눌렸어?", event.keyCode);
        keysDown[event.keyCode] = true
        //console.log("keysDown 객체에 들어간 값은?", keysDown);
    })
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];
        //console.log("버튼 클릭 후",keysDown);

        //스페이스바(32)를 누르면 총알 발사
        if(event.keyCode === 32){
            createBullet() //총알 생성 함수
        }
    })
}

//총알 생성 함수
function createBullet(){
    console.log("총알 생성!");
    let b = new Bullet() //총알 하나 생성

    b.init() //총알 초기화
    console.log("새로운 총알 리스트", bulletList);
}

//적군 생성 함수
function createEnemy(){
    //const interval = setInterval(호출하고 싶은 함수, 시간(1초=1000))
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    }, 1000)
}

//2. 우주선의 xy좌표가 바뀌고 다시 render 그려준다.
// 우주선이 오른쪽으로 간다 : x좌표 값이 증가한다.
// 우주선이 왼쪽으로 간다 : y좌표 값이 증가한다.
// 39 : 오른쪽 , 37 : 왼쪽
function update(){
    if(39 in keysDown){
        spaceshipX += 5; //우주선의 속도
    } 
    if(37 in keysDown){
        spaceshipX -= 5;
    }

    //우주선의 좌표값이 무한대로 업데이트가 되는게 아닌
    //경기장 안에서만 있게 하려면??
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64;
    }

    //총알에 y좌표 업데이트 하는 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    //적군의 y좌표 업데이트 하는 함수 호출
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

//웹사이트 시작하면 떠야하는 것들
loadImage();
setupKeyboardListener();
createEnemy();
main();


//우주선 만들기
//1. 방향키를 누르면
//2. 우주선의 x,y좌표가 바뀌고
//3. 다시 render(그려준) 한다.

//총알만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표 
//3. 발사된 총알들은 총알 배열에 저장을 한다
//4. 모든 총알들은 x, y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render(그려준) 한다

//적군 만들기
//1. 적군은 위치가 랜덤하다
//2. 적군은 밑으로 내려온다. -> y좌표가 ++ 증가한다
//3. 1초마다 하나씩 적군이 나온다
//4. 적군의 우주선이 바닥에 닿으면 게임오버
//5. 적군과 총알이 만나면 우주선이 사라진다. (점수 1점 획득)

//적군이 죽는다
//1. 총알이 적군이 닿으면 죽음
// 총알.y <= 적군.y
// 총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넗이
//2. 적군을 죽이면 점수 획득