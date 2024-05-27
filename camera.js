let video;
let poseNet;
let pose;
let score = 0;
let mode;
let timer = 0;
let correcttime=0;
let endtimer = 0;
let lock=new Boolean(false);
let label_pose = document.getElementById("labelpose");
let label_score = document.getElementById("labelscore");
let label_time=document.getElementById("labeltime");
let img=document.getElementById("img1");

function setup() {
  createCanvas(640, 480, cam);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  mode = 1;
}

function draw() {
  if(timer<20){
    label_time.innerText="答對";
  }else{label_time.innerText="...";}
  console.log(lock.toString());
  if(endtimer>30000){
    alert("你的分數是"+score);
  }
  if (pose) {
    if (timer > 20 && lock==false) {
      if(mode==0){
        img.src="https://media.gq.com.tw/photos/5dbc4dcb801fc800083f31f3/master/w_1600%2Cc_limit/2018053058351453.jpg";
        mode=1;
      }
      else{
        img.src="https://p0.itc.cn/q_70/images03/20220710/5a95c6e2c4f04d9e923ea7617ef00513.jpeg"
        mode=0;
      }
      timer = 0;
      lock=true;
    }
    timer = timer + 1;
    endtimer=endtimer+1;
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0);
    switch (mode) {
      case 0:
        label_pose.innerText = "開合跳";
        console.log("跳");
        if (isJumpingJack(pose)&&lock == true) {
          score = score + 1;
          label_score.innerText=score;
          lock=false;
        }
        break;
      case 1:
        label_pose.innerText = "深蹲";
        console.log("蹲");
        if (isSquat(pose)&& lock == true) {
          score = score + 1;
          label_score.innerText=score;          
          lock=false;
        }
        break;
      default:
        console.log("error");
    }

    fill(255, 255, 0); //color
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
  }
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function isJumpingJack(pose) {
  if ((pose.leftWrist.x - pose.rightWrist.x < 100) && (pose.leftWrist.y < pose.leftEar.y)) {
    return true;
  } else return false;
}

function isSquat(pose) {
  if ((pose.leftKnee.y - pose.leftHip.y < 100) /*&& (pose.rightKnee.y - pose.rightHip.y < 100)*/) {
    return true;
  } else return false;
}