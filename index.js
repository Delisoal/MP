function id(id){
  return document.getElementById(id);
}
function setMP(){
  fetch("./embed/"+id("mpname").value+"?d="+new Date().getTime()).then(function(data){
    return data.text();
  }).then(function(html){
    id("config").innerHTML=html;
    setEmbed();
    window.onresize=setEmbed;
    id("source").innerHTML="";
    document.querySelectorAll(".source").forEach(function(element){
      let li=document.createElement("li");
      let clone=element.cloneNode(true);
      clone.classList.remove("source");
      clone.target="_blank";
      li.appendChild(clone);
      id("source").appendChild(li);
      element.remove();
    });
  });
}
setMP();
id("mpname").oninput=setMP;
function setEmbed(){
  let minArray=[];
  let maxArray=[];
  document.querySelectorAll("#config input,#config select").forEach(function(element){
    let min=element.value.split(",")[0];
    let max=element.value.split(",")[1];
    min?minArray[minArray.length]=min:"";
    max?maxArray[maxArray.length]=max:"";
  });
  let min=minArray.sort(function(a,b){return b-a})[0];
  let max=maxArray.sort(function(a,b){return a-b})[0];
  let canvas=id("display");
  let ctx=canvas.getContext("2d");
  let modeldiv=document.createElement("div");
  let nowYear=new Date().getFullYear();
  let margin=30;
  modeldiv.style.cssText="width:90%;height:calc(90% - 3em)";
  id("result").appendChild(modeldiv);
  let width=modeldiv.offsetWidth;
  let height=modeldiv.offsetHeight;
  modeldiv.remove();
  canvas.width=width;
  canvas.height=height;
  ctx.font="12px sans-serif";
  ctx.textAlign="center"; 
  let count=(Math.ceil(nowYear/10)*10-Math.floor((min||1980)/10)*10)/10;
  let spacing=(width-margin*2)/count;
  for(let i=0;i<count+1;i++){
    let x=Math.round(margin+i*spacing);
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineWidth=1;
    ctx.strokeStyle="#d3d5d9";
    ctx.lineTo(x,height*0.7);
    ctx.stroke();
    let year=Math.floor((min||1980)/10)*10+i*10;
    ctx.fillText(year,x,height*0.8);
  }
  if(min<(max||nowYear)){
    let baseYear=Math.floor((min||1980)/10)*10;
    let startIndex=(min-baseYear)/10;
    let endIndex=((max||nowYear)-baseYear)/10;
    let barStartX=Math.round(margin+startIndex*spacing);
    let barEndX=Math.round(margin+endIndex*spacing);
    let barY=height*0.25;
    let barHeight=height*0.2;
    ctx.fillStyle="#4287f5";
    ctx.fillRect(barStartX,barY,barEndX-barStartX,barHeight);
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.fillText(`${min} - ${max||"販売中"}`,(barStartX+barEndX)/2,barY+barHeight/2+6);
    id("sp").innerHTML=`${min}年 - ${(max||"販売中")+(max?"年":"")}`;
  }
  else{
    id("sp").innerHTML="エラー";
  }
}
id("config").oninput=setEmbed;
