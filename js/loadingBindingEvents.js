var userInfoObj ={},spaceObj={},userNameToIdMap={}

/*Fetch Existing Users information */
Data.User.getAll().then(function(userData){
    for(var i=0;i<userData.length;i++){
    	userInfoObj[userData[i].id] =  userData[i]
    	userNameToIdMap[userData[i].first_name+" "+userData[i].last_name] = userData[i].id
    }
});

/*Loading Initial Screen with existing spaces */
Data.Space.getAll().then(function(spaceData){
    spaceObj={}
    $.ajax({
		    url: "html/loadingScreen.html",
		    success: function (loadingScreenContent) { 
		    	
		    	$("body").html(loadingScreenContent)

		    	for(var i=0;i<spaceData.length;i++){
				    	spaceObj[spaceData[i].id] = spaceData[i];
				    	(function(i){
					
						    populateData(i)
						   
						}).call(spaceData[i],spaceData[i].id)
				    }
				    bindEvents()
		    },
		    dataType: 'html'
		});
});

/*loading spaces*/
var loadSpaces = function(){
	Data.Space.getAll().then(function(spaceData){
		    	
		for(var i=0;i<spaceData.length;i++){
			spaceObj[spaceData[i].id] = spaceData[i];
				(function(i){
					populateData(i)
						   
				}).call(spaceData[i],spaceData[i].id)
		}
	})
}

/*populating space information*/
var populateData = function(id){
    	$.ajax({
		    url: "html/usrSpace.html",
		    success: function (usrSpace) { 
		    	debugger
		    	var usrSpaceDiv = $(usrSpace)
		    	$(usrSpaceDiv).find(".spaceTitle").attr("data-spaceid",spaceObj[id].id);
		    	$(usrSpaceDiv).find(".spaceTitle").html(spaceObj[id].title +" created by "+userInfoObj[spaceObj[id].created_by].first_name+" "+userInfoObj[spaceObj[id].created_by].last_name)
	    		$(usrSpaceDiv).find(".spaceDescr").html(spaceObj[id].description)
	    		if(id%2 ==0){
	    			$(".userSpaceContainerRight").append($(usrSpaceDiv))
	    		}
	    		else{
	    			$(".userSpaceContainerLeft").append($(usrSpaceDiv))
	    		}
	    		
		    },
		    dataType: 'html'
		});
  
}

/*Action Events*/
var bindEvents = function(){

/*Delete Space*/
$("div").on( "click", ".deleteSpace", function(e) {
  e.stopPropagation();
	var spaceDivId = parseInt($(this).closest(".userSpace").find(".spaceTitle").attr("data-spaceId"))
	Data.Space.deleteById(spaceDivId).then(function (res){
		Data.Space.getAll().then(function(spaceData){
			$('.userSpaceContainerLeft').empty()
		    $('.userSpaceContainerRight').empty()
			spaceObj={}
			for(var i=0;i<spaceData.length;i++){
			    spaceObj[spaceData[i].id] = spaceData[i];
			    (function(i){
				
					populateData(i)
					   
				}).call(spaceData[i],spaceData[i].id)
			}
		})
	})
})


/* Edit Space Information*/
$("div").on( "click", ".editSpace", function(e) {
	e.stopPropagation();
	var spaceDivId = parseInt($(this).closest(".userSpace").find(".spaceTitle").attr("data-spaceid"))
	Data.Space.getById(spaceDivId).then(function(spaceDetails){
		var membersArray = spaceDetails.members
		$.ajax({
		    url: "html/spaceInfo.html",
		    success: function (spaceInfoContent) { 
		    	var $currentSpaceInfo = $(spaceInfoContent)
		    	if(spaceObj[spaceDivId].welcome)  $($currentSpaceInfo).find("#welcome").prop('checked', true);
		    	if(spaceObj[spaceDivId].private)  $($currentSpaceInfo).find("#private").prop('checked', true);
		    	if(spaceObj[spaceDivId].featured) $($currentSpaceInfo).find("#featured").prop('checked', true);
		    	$($currentSpaceInfo).find(".spcTitle").attr("data-spaceId",spaceObj[spaceDivId].id)
		    	$($currentSpaceInfo).find(".spcTitle").val(spaceObj[spaceDivId].title)
		    	$($currentSpaceInfo).find("#spcDescr").val(spaceObj[spaceDivId].description)

		    	if(membersArray){
		    		for(var i=0;i<membersArray.length;i++){
				    	$($currentSpaceInfo).find("#spcMembers").append('<div class="existingMemberDiv"><div class="existingMember"><i class="fa fa-user-o userIcon" aria-hidden="true"></i><span>'+userInfoObj[membersArray[i]].first_name+" "+userInfoObj[membersArray[i]].last_name+'</span></div><span class="deleteUsr"><i class="fa fa-minus-circle deleteUsrIcon" title="Remove Member" aria-hidden="true"></i></span></div>')
				    }
		    	}
		    	else{
		    		$($currentSpaceInfo).find("#spcMembers").append('<div>None</div>')
		    	}

		    	$(".userSpaceContainer").html($currentSpaceInfo)
		    },
		    dataType: 'html'
		});
	})
})

/*Create New Space*/
$("#addSpace").on("click",function(e){
	e.stopPropagation();
	$.ajax({
		    url: "html/createSpace.html",
		    success: function (createSpaceContent) { 
		    	var createSpaceContentDiv = $(createSpaceContent)
		    	fecthUsrNameDrpDpwn("createdByUser",false)
		    	$(".userSpaceContainer").html(createSpaceContentDiv)
		    },
		    dataType: 'html'
		});
})

/*Existing User DropDown creation*/
var fecthUsrNameDrpDpwn = function(createdByUserSelector,newDiv){
	var usrNameDrpDown =""
	if(newDiv)
		usrNameDrpDown +="<div class='"+createdByUserSelector+"_drpDwn'><select>"
	else
		usrNameDrpDown +="<select class='"+createdByUserSelector+"_drpDwn'>"
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
	})
}

/*Save New Space*/
$("div").on( "click", ".saveNewSpace", function(e) {
	  e.stopPropagation();
	  var memberId =[]
	  var $membersDrpDwn = $("#spcMembers").find("select")
	  for(var i=0;i< $membersDrpDwn.length;i++){
	  	var newMemberId = parseInt($($($membersDrpDwn)[i]).val())
	  	if(memberId.indexOf(newMemberId) == -1){
		  	memberId.push(newMemberId)
		 }
	  }
	  var spaceParams = {
	    "title" : $('#spaceTitle').val().trim(),
	    "description" : $('#spcDescr').val().trim(),
	    "members": (memberId.length > 0)?memberId:null,
	    "created_by":parseInt($('.createdByUser_drpDwn').val()),
	    "welcome":true,
	    "private":false,
	    "featured":false
	  }
	  if(!spaceParams.title || !spaceParams.description || !spaceParams.created_by){
	  	alert("Title, description and created by are mandatory fields");
	  }
	  else{
		  Data.Space.create(spaceParams).then(function(createdSpace){
		  	Data.Space.getAll().then(function(spaceData){
			spaceObj={}
		    $.ajax({
					    url: "html/loadingScreen.html",
					    success: function (loadingScreenContent) { 
					    	
					    	$("body").html(loadingScreenContent)

					    	for(var i=0;i<spaceData.length;i++){
							    	spaceObj[spaceData[i].id] = spaceData[i];
							    	(function(i){
								
									    populateData(i)
									   
									}).call(spaceData[i],spaceData[i].id)
							    }
							    bindEvents()
					    },
					    dataType: 'html'
					});
		  		});
		  	})
	}
})

/*Save Space Details After Edit*/
$("div").on( "click", ".saveEditedSpace", function(e) {
	e.stopPropagation();
  	var spaceId = parseInt($(".spcTitle").attr("data-spaceid"))
	Data.Space.getById(spaceId).then(function(spaceDetails){
		var memberId = (spaceDetails.members)?spaceDetails.members:[]
		var $membersDrpDwn = $(".newMembersDiv_drpDwn").find("select")
		for(var i=0;i< $membersDrpDwn.length;i++){
		  	var newMemberId = parseInt($($($membersDrpDwn)[i]).val())
		  	if(memberId.indexOf(newMemberId) == -1){
			  	memberId.push(newMemberId)
			}
		}
		var spaceParams = {
		  	"id":spaceId,
		    "title" : $('#spaceTitle').val().trim(),
		    "description" : $('#spcDescr').val().trim(),
		    "members": (memberId.length > 0)?memberId:null,
		    "created_by":parseInt($('.createdByUser_drpDwn').val()),
		    "welcome":$('#welcome').prop('checked'),
		    "private":$('#private').prop('checked'),
		    "featured":$('#featured').prop('checked')
		}
		if(!spaceParams.title || !spaceParams.description || !spaceParams.created_by){
		  	alert("Title, description and created by are mandatory fields");
		}
		else{
		  	
		  	Data.Space.updateById(spaceId,spaceParams).then(function(editedSpaceData){
				Data.Space.getAll().then(function(spaceData){
		    		$.ajax({
						    url: "html/loadingScreen.html",
						    success: function (loadingScreenContent) { 
						    	$("body").html(loadingScreenContent)
								for(var i=0;i<spaceData.length;i++){
								    	spaceObj[spaceData[i].id] = spaceData[i];
								    	(function(i){
											populateData(i)
										   
										}).call(spaceData[i],spaceData[i].id)
								    }
								    bindEvents()
						    },
						    dataType: 'html'
						});
					})
		    	});
			}
	})
})

/*New Member addition to existing Space*/
$("div").on("click","#addNewMemberToSpace",function(e){
	e.stopPropagation();
	if($("#spcMembers").find("div").text().trim() == "None"){
		$("#spcMembers").empty()
	}
 	fecthUsrNameDrpDpwn('newMembersDiv',true)
})

/*Add New member to newly created space*/
 $("div").on("click","#addMemberToSpace",function(e){
 	e.stopPropagation();
 	fecthUsrNameDrpDpwn('spcMembers',true)
 })


/*Go to main page*/
 $("div").on("click",".backButton",function(e){
 	e.stopPropagation();
 	$.ajax({
		    url: "html/loadingScreen.html",
		    success: function (spaceScreen) { 
		    	$("body").html(spaceScreen)
		    	loadSpaces()
		    	bindEvents()
		    },
		    dataType: 'html'
		});

 })

/*Delete New Member div*/
 $("div").on("click",".deleteDrpDwnIcon",function(e){
 	e.stopPropagation();
 	$(this).closest('.newMembersDiv_drpDwn').remove()
 })

/*Delete existing member from space*/
$("div").on("click",".deleteUsr",function(e){
 	e.stopPropagation();
 	var memberName = $(this).closest(".existingMemberDiv").find("span").text().trim()
 	var memberId = userNameToIdMap[memberName]
 	$(this).closest(".existingMemberDiv").remove()
 	var spaceId = parseInt($(".spcTitle").attr("data-spaceid"))
 	if(memberId){
 		Data.Space.getById(spaceId).then(function(spaceDetails){
 			var currentMembers = spaceDetails.members
 			var index = currentMembers.indexOf(memberId);
 			if(index >=0){
	 			currentMembers.splice(index, 1);
	 		}
 			var spaceParams = {
							  	"id":spaceDetails.id,
							    "title" : spaceDetails.title,
							    "description" : spaceDetails.description,
							    "members": (currentMembers.length > 0)?currentMembers:null,
							    "created_by":spaceDetails.created_by,
							    "welcome":spaceDetails.welcome,
							    "private":spaceDetails.private,
							    "featured":spaceDetails.featured
							  }
 			Data.Space.updateById(spaceId,spaceParams).then(function(res){
 				alert("Member Removed")
 			})
 		})
 	}
 })
}