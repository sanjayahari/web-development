const gridEl=document.getElementById("grid");
const cells=Array.from(gridEl.querySelectorAll(".cell"));
const size=4;
let grid=[];

function init(){
    grid=Array(size).fill().map(()=>Array(size).fill(0));
    addRandom();
    addRandom();
    render();
}

function addRandom(){
    const emptyCells=[];
    for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
            if(grid[r][c]===0){emptyCells.push([r,c]);
            }

        }
    }
        if(!emptyCells.length){return;}
        const [r,c]=emptyCells[Math.floor(Math.random()*emptyCells.length)];
        grid[r][c]=Math.random()<0.9?2:4;

    


}
function render(){
    for(const cellEl of cells){
        const r=Number(cellEl.dataset.r);
        const c=Number(cellEl.dataset.c);
        const value=grid[r][c];
        cellEl.textContent=value===0? '':value;
        cellEl.className='cell';
        if(value>0){
            cellEl.classList.add('tile-' +value);
        }
    }

}
function slide(row){
    let arr=row.filter(value=> value!==0);
    for(let i=0;i<arr.length-1;i++){
        if(arr[i]===arr[i+1]){
            arr[i]*=2;
            arr[i+1]=0;
            i++;
        }
    }
    arr=arr.filter(value=>value!==0);
    while(arr.length<size){
        arr.push(0);
    }
    return arr;

}
function rotateGrid(times){
    for(let t=0;t<times;t++){
    const newGrid=Array(size).fill(null).map(()=>Array(size).fill(0));
    
    for(let r=0;r<size;r++){
        for(let c=0;c<size;c++){
            newGrid[c][size-1-r]=grid[r][c];
        }
    }
    grid=newGrid;
 }
}
function move(direction){
    rotateGrid(direction);
    let moved=false;
    for(let r=0;r<size;r++){
         const oldRow= grid[r].slice();    // can use [...grid[r]] also but slightly slower
        const newRow=slide(oldRow);
        grid[r]=newRow;
        if(oldRow.toString()!==newRow.toString()){moved=true;}

    }
    rotateGrid((4-direction)%4);
    if(moved){
        addRandom();
        render();

    }
}

function enableControls(id){
    return document.getElementById(id).checked;
}

//keyboard controls
document.addEventListener('keydown', e=>{
    if(!enableControls('keyboardControl')){
        return;
    }
    const k=e.key.toLowerCase();
    if((k==="arrowleft")||(k==='a')){
        move(0);
    }
    if((k==="arrowup")||(k==='w')){
        move(1);
    }
   if((k==="arrowright")||(k==='d')){
        move(2);
    }
    if((k==="arrowdown")||(k==='s')){
        move(3);
    }
});

//swipe / touch control(for tumahara mobile)

let touchStartX=0,touchStartY=0;
document.addEventListener('touchstart' ,e=>{
    if(!enableControls('swipeControl')){
        return;
    }
    const t=e.touches[0];
    touchStartX=t.clientX;
    touchStartY=t.clientY;
},{passive:true}

);

document.addEventListener('touchend',e=>{
    if(!enableControls("swipeControl")){
        return;
    }
    const t=e.changedTouches[0];
    const dx=t.clientX-touchStartX; 
    const dy=t.clientY-touchStartY;
    const ax=Math.abs(dx) , ay=Math.abs(dy);
    if(Math.max(ax,ay)<20){
        return;
    }
    if(ax>ay){
        move(dx>0?2:0);
    }
    else{
        move(dy>0?3:1)
    }
       }
,{passive:true});

init();


