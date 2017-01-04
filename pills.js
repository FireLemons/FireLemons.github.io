var versions = ["Antibirth", "AfterBirth", "Rebirth"];//, "AfterBirth+"];
var pillEffects = ["???", "48 Hour Energy", "Amnesia", "Bad Gas", "Bad Trip", "Balls of Steel", 
	"Bombs Are Key", "Explosive Diarrhea", "Full Health", "Health Down", "Health Up",
	"Hematemesis", "I Can See Forever", "I Found Pills", "Lemon Party", "Luck Down",
	"Luck Up", "Paralysis", "Pheromones", "Puberty", "Pretty Fly", "Range Down", "Range Up",
	"R U a Wizard?", "Speed Down", "Speed Up", "Tears Down", "Tears Up", "Telepills"];
var antiPills = ["Experimental Pill", "Shot Speed Down", "Shot Speed Up"];
var afterPills = ["???(Curse of the Maze)", "Addicted", "Friends Till The End!", "Infested!",
	"Infested?", "One Makes You Small", "One Makes You Larger", "Percs", "Power Pill", "Re-Lax", "Retro Vision"];
var afterPlusPills = ["I'm Drowsy...", ""];
var afterPillsUI = [
	{url:"Images/Pills/AfterBirth/Black_White.png", alt:"White Top with Black Bottom"},
	{url:"Images/Pills/AfterBirth/Black_Yellow.png", alt:"Black Top with Yellow Bottom"}, 
	{url:"Images/Pills/AfterBirth/White_Cyan.png", alt:"White Top with Cyan Bottom"},
	{url:"Images/Pills/AfterBirth/White_Yellow.png", alt:"White Top with Yellow Bottom"}];
var pills = new Array(13).fill(1);
var cycleLock = {timeoutLock:null, intervalLock:null};
	
$(function(){

	var versionIndex = 0;
	
	$("div#topControls img").height($("div#topControls").height());
	
	switchVersion(2);
	applyListeners($("#pillInfo td"));
	
	$("img#reset").click(function(){
		
		for(i = 0; i < pills.length; i++){
			
			pills[i] = 1;
		}
		
		$("#pillInfo p").text("???");
	});
	
	$("img#phd").click(function(){
		
		$("#pillInfo p").each(function(){
			
			switch($(this).text()){
				
				case "Amnesia":
					
					setEffect($(this), "I Can See Forever");
				return;
				
				case "Bad Trip":
				
					setEffect($(this), "Balls of Steel");
				return;
				
				case "Health Down":
					
					setEffect($(this), "Health Up");
				return;
				
				case "Luck Down":
					
					setEffect($(this), "Luck Up");
				return;
				
				case "Range Down":
				
					setEffect($(this), "Range Up");
				return;
				
				case "Speed Down":
				
					setEffect($(this), "Speed Up");
				return;
				
				case "Tears Down":
				
					setEffect($(this), "Tears Up");
				return;
			}
		});
	});
	
	$("#version_header").click(function(){
		
		switchVersion(versionIndex);
		versionIndex++;
		versionIndex %= versions.length;
		$("#version_header").text(versions[versionIndex]);
	});
});

function switchVersion(version){
	
	switch(version){
		
		case 0:
		
			removeElements(antiPills, pillEffects);
			addElements(afterPills, pillEffects);
			afterPillsUI.forEach(function(element, index){
				
				if(index % 3 == 0){
					
					$("#pillInfo tbody").append("<tr class = 'afterBirth'></tr>");
				}
				
				$($("#pillInfo tbody tr.afterBirth").get(Math.floor(index / 3))).append("<td title='Try scrolling or holding down the button.'><img alt='" + element.alt + "' class='noSelect' src=" + element.url + "></td>");
			});
			
			applyListeners($("#pillInfo tr.afterBirth td"));
		return;
		
		case 1:
			
			removeElements(afterPills, pillEffects);
			$(".afterBirth").remove();
		return;
		
		case 2:
		
			addElements(antiPills, pillEffects);
		return;
	}
}

function addElements(addArr, containerArr){
	
	addArr.forEach(function(element){
		
		containerArr.push(element);
	});
			
	containerArr.sort();
}

function removeElements(removeArr, containerArr){
	
	removeArr.forEach(function(element){
				
		var removeIndex = containerArr.indexOf(element);
			
		if(removeIndex >= 0){
					
			containerArr.splice(removeIndex, 1);
		}
	});
}

function getPillIndex(tableCell){
	
	return tableCell.index() + tableCell.parent().index() * 3;
}

function setEffect(tableCellText, value){
	
	tableCellText.text(value);
	pills[getPillIndex(tableCellText.parent())] = pillEffects.indexOf(value);
}

function changeEffect(tableCell, direction){
	
	var index = getPillIndex(tableCell);
	
	if(direction){
			
		pills[index]++;
	}else{
		
		pills[index] = (pills[index] - 1 < 0) ? pillEffects.length - 1 : pills[index] - 1;
	}
	
	pills[index] %= pillEffects.length;
	
	tableCell.children("p").text(pillEffects[pills[index]]);
}

function changeEffectScroll(e){
	
	changeEffect($(this), e.deltaY < 0);
}

function stopScrolling(e){
	
	e.preventDefault();
	e.stopPropagation();
	return false;
}

function applyListeners(element){
	
	element.append("<p class='noSelect'>" + pillEffects[1] + "</p>");
	element.on('scroll touchmove mousewheel', stopScrolling);
	element.mousewheel(changeEffectScroll);
	element.on("mouseleave mouseup", function(){
		
		clearInterval(cycleLock.intervalLock);
		clearTimeout(cycleLock.timeoutLock);
	});
	element.mousedown(function(e){
		
		var direction = $(this).width() / 2 < (e.pageX - $(this).offset().left);
		var instance = $(this);
		changeEffect(instance, direction);
		
		cycleLock.timeoutLock = setTimeout(function(){
			
			cycleLock.intervalLock = setInterval(function(){changeEffect(instance, direction);}, 200);
		}, 300);
	});
}
