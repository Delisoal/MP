function id(id){
  return document.getElementById(id);
}
let minArray=[];
let maxArray=[];
function setMP(){
  fetch("./embed/"+id("mpname").value).then(function(data){
    return data.text();
  }).then(function(html){
    id("config").innerHTML=html;
    setEmbed();
  });
}
setMP();
id("mpname").oninput=setMP;
function setEmbed(){
  minArray=maxArray=[];
  document.querySelectorAll("#config input,#config select").forEach(function(element){
    let min=element.value.split(",")[0];
    let max=element.value.split(",")[1];
    min?minArray[minArray.length]=min:"";
    max?maxArray[maxArray.length]=max:"";
    console.log(min,max,element.value.split(","));
  });
  let min=minArray.sort(function(a,b){return a-b})[0];
  let max=maxArray.sort(function(a,b){return b-a})[0];
  let canvas=id("display");
  let ctx=canvas.getContext("2d");
  let width=id("result").offsetWidth*0.8;
  let height=id("result").offsetHeight*0.6;
  let nowYear=new Date().getFullYear();
  canvas.width=width;
  canvas.height=height;
  ctx.font="12px sans-serif";
  ctx.textAlign="center"; 
  let count=(Math.ceil(nowYear/10)*10-Math.floor((min||1980)/10)*10)/10;
  let spacing=(width-30)/count;
  for(let i=0;i<count+1;i++){
    let x=Math.round(15+i*spacing);
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineWidth=1;
    ctx.lineTo(x,height*0.7);
    ctx.stroke();
    let year=Math.floor((min||1980)/10)*10+i*10;
    ctx.fillText(year,x,height*0.8);
  }
  let baseYear=Math.floor((min||1980)/10)*10;
  let startIndex=(min-baseYear)/10;
  let endIndex=((max||nowYear)-baseYear)/10;
  let barStartX=Math.round(15+startIndex*spacing);
  let barEndX=Math.round(15+endIndex*spacing);
  let barY=height*0.25;
  let barHeight=height*0.2;
  ctx.fillStyle="#4287f5";
  ctx.fillRect(barStartX,barY,barEndX-barStartX,barHeight);
  ctx.fillStyle="white";
  ctx.textAlign="center";
  ctx.fillText(`${min} - ${max||"販売中"}`,(barStartX+barEndX)/2,barY+barHeight/2+6);
  id("sp").innerHTML=`${min}年 - ${(max||"販売中")+(max?"年":"")}`;
}
id("config").oninput=setEmbed;
