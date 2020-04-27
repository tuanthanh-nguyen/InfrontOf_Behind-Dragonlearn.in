function doFirst(){
    mypic=document.getElementById('ball');
    mypic.addEventListener("dragstart", startDrag, false);
    mypic.addEventListener("dragend", endDrag, false);
    placement=document.getElementById('placement');
    placement.addEventListener("dragenter",dragenter,false);
    placement.addEventListener("dragleave",dragleave,false);
    placement.addEventListener("dragover",function(e){e.preventDefault();},false);
    placement.addEventListener("drop",dropped,false);
}

function endDrag(e){
    pic =e.target;
    pic.style.visibility = 'hidden';
}

function dragenter(e){
    e.preventDefault();
}

function dragleave(e){  

}

function startDrag(e){
    var code = '<img src="../image/35.png">';
    e.dataTransfer.setData('Text', code);
}

function dropped(e){
    e.preventDefault();
    placement.innerHTML = e.dataTransfer.getData('Text')
}
window.addEventListener("load", doFirst, false);