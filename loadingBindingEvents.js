var userInfoObj ={},spaceObj={},userNameToIdMap={}//,spaceArray=[]
Data.User.getAll().then(function(userData){
    debugger
    for(var i=0;i<userData.length;i++){
    	userInfoObj[userData[i].id] =  userData[i]
    	userNameToIdMap[userData[i].first_name+" "+userData[i].last_name] = userData[i].id
    	console.log(userData[i])
    }
   
});

Data.Space.getAll().then(function(spaceData){
	debugger
    //spaceArray=[],
    spaceObj={}
    $.ajax({
		    url: "loadingScreen.html",
		    success: function (loadingScreenContent) { 
		    	
		    	$("body").html(loadingScreenContent)

		    	for(var i=0;i<spaceData.length;i++){
				    //	spaceArray.push(spaceData[i])
				    	spaceObj[spaceData[i].id] = spaceData[i];
				    	(function(i){
					
						    populateData(i)
						   
						}).call(spaceData[i],spaceData[i].id)
				    }
				    bindEvents()
		    },
		    dataType: 'html'//,
        	//async: false
		});
    
	  
});

var loadSpaces = function(){
	Data.Space.getAll().then(function(spaceData){
		    	
		    	for(var i=0;i<spaceData.length;i++){
				    	//spaceArray.push(spaceData[i])
				    	spaceObj[spaceData[i].id] = spaceData[i];
				    	(function(i){
					
						    populateData(i)
						   
						}).call(spaceData[i],spaceData[i].id)
				    }
				})
}

var populateData = function(id){
	debugger
    	$.ajax({
		    url: "usrSpace.html",
		    success: function (usrSpace) { 
		    	debugger
		    	var usrSpaceDiv = $(usrSpace)
		    	$(usrSpaceDiv).attr("data-spaceId",spaceObj[id].id);
		    	$(usrSpaceDiv).find(".spaceTitle").html(spaceObj[id].title +" created by "+userInfoObj[spaceObj[id].created_by].first_name+" "+userInfoObj[spaceObj[id].created_by].last_name)
	    		$(usrSpaceDiv).find(".spaceDescr").html(spaceObj[id].description)
	    		if(id%2 ==0){
	    			$(".userSpaceContainerRight").append($(usrSpaceDiv))
	    		}
	    		else{
	    			$(".userSpaceContainerLeft").append($(usrSpaceDiv))
	    		}
	    		
		    },
		    dataType: 'html'//,
        	//async: false
		});
  
}
var bindEvents = function(){
$("div").on( "click", ".deleteSpace", function(e) {
  debugger
  e.stopPropagation();
	var spaceDivId = parseInt($(this).closest(".userSpace").attr("data-spaceId"))
	Data.Space.deleteById(spaceDivId).then(function (res){
		debugger
			Data.Space.getAll().then(function(spaceData){
			    debugger
			    $('.userSpaceContainerLeft').empty()
			    $('.userSpaceContainerRight').empty()
			    //spaceArray=[],
			    spaceObj={}
			    for(var i=0;i<spaceData.length;i++){
			    	//spaceArray.push(spaceData[i])
			    	spaceObj[spaceData[i].id] = spaceData[i];
			    	//console.log(spaceData[i])
			    	//populateData(spaceData[i].id)
			    	(function(i){
				
					    populateData(i)
					   
					}).call(spaceData[i],spaceData[i].id)
			    }

		  
			})
		})
})



$("div").on( "click", ".editSpace", function() {
  debugger
	var spaceDivId = parseInt($(this).closest(".userSpace").attr("data-spaceId"))
	//Data.Space.deleteById(spaceDivId);
	//location.reload(); 
	$.ajax({
		    url: "spaceInfo.html",
		    success: function (spaceInfoContent) { 
		    	debugger
		    	var $currentSpaceInfo = $(spaceInfoContent)
		    	if(spaceObj[spaceDivId].welcome)  $($currentSpaceInfo).find("#welcome").prop('checked', true);
		    	if(spaceObj[spaceDivId].private)  $($currentSpaceInfo).find("#private").prop('checked', true);
		    	if(spaceObj[spaceDivId].featured) $($currentSpaceInfo).find("#featured").prop('checked', true);

		    	/*$($currentSpaceInfo).find(".spcTitle").attr("placeholder",spaceObj[spaceDivId].title)
		    	$($currentSpaceInfo).find("#spcDescr").attr("placeholder",spaceObj[spaceDivId].description)*/
		    	$($currentSpaceInfo).find(".spcTitle").val(spaceObj[spaceDivId].title)
		    	$($currentSpaceInfo).find("#spcDescr").val(spaceObj[spaceDivId].description)

		    	var membersArray = spaceObj[spaceDivId].members

		    	if(membersArray){
		    		for(var i=0;i<membersArray.length;i++){
				    	$($currentSpaceInfo).find("#spcMembers").append('<div><i class="fa fa-user-o userIcon" aria-hidden="true"></i><span>'+userInfoObj[membersArray[i]].first_name+" "+userInfoObj[membersArray[i]].last_name+'</span></div>')
				    }
		    	}
		    	else{
		    		$($currentSpaceInfo).find("#spcMembers").append('<div>None</div>')
		    	}

		    	$(".userSpaceContainer").html($currentSpaceInfo)
		    },
		    dataType: 'html'//,
        	//async: false
		});
})

$("#addSpace").on("click",function(e){
	debugger
	e.stopPropagation();
	$.ajax({
		    url: "CreateSpace.html",
		    success: function (createSpaceContent) { 
		    	debugger
		    	var createSpaceContentDiv = $(createSpaceContent)
		    	//var drpDown = fecthUsrNameDrpDpwn()
		    	fecthUsrNameDrpDpwn("createdByUser",false)
		    	//$(createSpaceContentDiv).find('.createdBy').append(drpDown)
		    	$(".userSpaceContainer").html(createSpaceContentDiv)
		    },
		    dataType: 'html'//,
        	//async: false
		});

})
var fecthUsrNameDrpDpwn = function(createdByUserSelector,newDiv){
	debugger
	var usrNameDrpDown =""
	if(newDiv)
		usrNameDrpDown +="<div class='"+createdByUserSelector+"_drpDwn'><select>"
	else
		usrNameDrpDown +="<select class='"+createdByUserSelector+"_drpDwn'>"
	//var usrNameDrpDown ="<select>"
	Data.User.getAll().then(function(userData){
		for(var i=0;i<userData.length;i++){
			var usrName = userData[i].first_name + " "+ userData[i].last_name
			usrNameDrpDown+='<option value="'+userData[i].id+'" >'+usrName +'</option>'
		}
	if(newDiv)
		usrNameDrpDown +='</select><span class="deleteDrpDwn"><i class="fa fa-minus-circle deleteDrpDwnIcon" title="Remove Member" aria-hidden="true"></i></span></div>'
	else
		usrNameDrpDown +='</select><span class="deleteDrpDwn"><i class="fa fa-minus-circle deleteDrpDwnIcon" title="Remove Member" aria-hidden="true"></i></span>'
	$('#'+createdByUserSelector).append(usrNameDrpDown)
		//return usrNameDrpDown
	})
}

 $("div").on( "click", ".saveNewSpace", function(e) {
//$("#saveNewSpace").on("click",function(e){
	e.stopPropagation();
  debugger
  var memberId =[]
  var $membersDrpDwn = $("#spcMembers").find("select")
  for(var i=0;i< $membersDrpDwn.length;i++){
  	var newMemberId = parseInt($($($membersDrpDwn)[i]).val())
  	if(memberId.indexOf(newMemberId) == -1){
	  	memberId.push()
	 }
  }
  var spaceParams = {
    "title" : $('#spaceTitle').val().trim(),
    "description" : $('#spcDescr').val().trim(),
    "members": (memberId.length > 0)?memberId:null,
    "created_by":parseInt($('.createdByUser_drpDwn').val()),//userNameToIdMap[$('#createdByUser_drpDwn').val().trim()],
    "welcome":true,
    "private":false,
    "featured":false
  }
  if(!spaceParams.title || !spaceParams.description || !spaceParams.created_by){
  	alert("Title, description and created by are mandatory fields");
  }
	else{
	  Data.Space.create(spaceParams).then(function(createdSpace){
	  	debugger
	  	alert("New Space created");
	  	Data.Space.getAll().then(function(spaceData){
		debugger
	   // spaceArray=[],
	    spaceObj={}
	    $.ajax({
			    url: "loadingScreen.html",
			    success: function (loadingScreenContent) { 
			    	
			    	$("body").html(loadingScreenContent)

			    	for(var i=0;i<spaceData.length;i++){
					    	//spaceArray.push(spaceData[i])
					    	spaceObj[spaceData[i].id] = spaceData[i];
					    	(function(i){
						
							    populateData(i)
							   
							}).call(spaceData[i],spaceData[i].id)
					    }
					    bindEvents()
			    },
			    dataType: 'html'//,
	        	//async: false
			});
	    
		  
	});
	  	

	  })
	}
})
$("div").on("click","#addNewMemberToSpace",function(e){
	debugger
	e.stopPropagation();
 	fecthUsrNameDrpDpwn('newMembersDiv',true)
})

 $("div").on("click","#addMemberToSpace",function(e){
 	debugger
 	e.stopPropagation();
 	fecthUsrNameDrpDpwn('spcMembers',true)
 })

 $("div").on("click",".backButton",function(e){
 	debugger
 	e.stopPropagation();
 	$.ajax({
		    url: "loadingScreen.html",
		    success: function (spaceScreen) { 
		    	debugger
		    	$("body").html(spaceScreen)
		    	loadSpaces()
		    	bindEvents()
		    },
		    dataType: 'html'//,
        	//async: false
		});

 })
 $("div").on("click",".deleteDrpDwnIcon",function(){
 	debugger
 	$(this).closest("div").find('select').remove()
 	$(this).closest("div").find('.deleteDrpDwnIcon').remove()
 })
}