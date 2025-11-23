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
  document.querySelectorAll("input,select").forEach(function(element){
    let min=element.value.split(",")[0];
    let max=element.value.split(",")[1];
    min?minArray[minArray.length]=min:"";
    max?maxArray[maxArray.length]=max:"";
  });
  let min=minArray.sort(function(a,b){return a-b})[0];
  let max=maxArray.sort(function(a,b){return b-a})[0];
  console.log(min,max);
}
id("config").oninput=setEmbed();
