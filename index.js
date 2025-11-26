function id(id){
  return document.getElementById(id);
}
function setMP(){
  id("loading").style.display="";
  document.querySelectorAll("#config input,#config select").forEach(function(element){
    element.disabled=true;
  });
  fetch("./embed/"+id("mpname").value+"?d="+new Date().getTime()).then(function(data){
    return data.text();
  }).then(function(html){
    fetch("./embed/main.html").then(function(data){
      return data.text();
    }).then(function(mainHTML){
      id("embed").innerHTML=html;
      id("main").innerHTML=mainHTML;
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
      id("loading").style.display="none";
      document.querySelectorAll("#config input,#config select").forEach(function(element){
        element.disabled=false;
      });
    });
  });
}
setMP();
id("mpname").oninput=setMP;
function setEmbed(){
  let minArray=[];
  let maxArray=[];
  document.querySelectorAll("#config input,#config select").forEach(function(element){
    function getType(num){
      return String(num).split("")[4]||"";
    }
    function toNum(num){
      return Number(String(num).match(/[0-9][0-9][0-9][0-9]/g).join(""));
    }
    function getAdd(num){
      return Number(String(num).split("?")[1]||10);
    }
    let min=element.value.split(",")[0];
    let max=element.value.split(",")[1];
    min?minArray[minArray.length]={value:toNum(min),valid:toNum(min),type:getType(min),add:getAdd(min)}:"";
    max?maxArray[maxArray.length]={value:toNum(max),valid:toNum(max),type:getType(max),add:getAdd(max)}:"";
  });
  maxArray?maxArray=maxArray.map(function(data){
    if(data.type=="?"){
      return {valid:data.value,value:data.value+data.add,type:data.type,add:data.add};
    }
    else{
      return data;
    }
  }):"";
  let minObj=minArray.sort(function(a,b){return b.value-a.value})[0];
  let maxObj=maxArray.sort(function(a,b){return a.value-b.value})[0];
  console.log(minArray,maxArray);
  let min=minObj.valid;
  let max=maxObj?maxObj.valid:null;
  let canvas=id("display");
  let ctx=canvas.getContext("2d");
  let modeldiv=document.createElement("div");
  let nowYear=new Date().getFullYear();
  let margin=30;
  modeldiv.style.cssText="width:90%;height:calc(90% - 5em)";
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
    ctx.lineTo(x,height*0.65);
    ctx.stroke();
    let year=Math.floor((min||1980)/10)*10+i*10;
    ctx.fillText(year,x,height*0.8);
  }
  if(min<(max||nowYear)){
    let baseYear=Math.floor((min||1980)/10)*10;
    let barStartX=Math.round(margin+((min-baseYear)/10)*spacing);
    let barEndX=Math.round(margin+(((max||nowYear)-baseYear)/10)*spacing);
    let barY=height*0.25;
    let barHeight=height*0.2;
    ctx.beginPath();
    ctx.fillStyle="#4287f5";
    ctx.fillRect(barStartX,barY,barEndX-barStartX,barHeight);
    ctx.closePath();
    [minObj,maxObj].forEach(function(data){
      if(data){
        if(data.type=="?"){
          let subBarStartX=Math.round(margin+((data.valid-baseYear)/10)*spacing);
          let subBarWidth=Math.round(margin+((data.valid+data.add-baseYear)/10)*spacing)-subBarStartX;
          ctx.beginPath();
          ctx.fillStyle="#a7c0f2";
          ctx.fillRect(subBarStartX,barY,subBarWidth,barHeight);
          ctx.closePath();
          barEndX+=subBarWidth/2;
        }
      }
    });
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.fillText(`${min}${minObj.type||""} - ${(max||"販売中")+(maxObj?(maxObj.type||""):"")}`,(barStartX+barEndX)/2,barY+barHeight/2+6);
    id("sp").innerHTML=`${min}年${minObj.type=="?"?"頃":""} - ${(max||"販売中")+(max?"年":"")+(maxObj?(maxObj.type=="?"?"頃":""):"")}`;
  }
  else{
    id("sp").innerHTML="エラー";
  }
}
id("config").oninput=setEmbed;
