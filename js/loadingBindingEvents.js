var userInfoObj ={},spaceObj={},userNameToIdMap={},spacesToDel=[],visits={}

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
				    	visits[spaceData[i].id] = spaceData[i].visitors;
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
		 debugger   	
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

$("div").on("click",".searchIcon",function(e){
	debugger
	e.stopPropagation();
	var searchInput = $(".searchBar").val()
	Data.Space.getAll().then(function(spaceData){
		 debugger   	
		for(var i=0;i<spaceData.length;i++){
			if(spaceData[i].title.toLowerCase().indexOf(searchInput.toLowerCase()) != -1 || spaceData[i].description.toLowerCase().indexOf(searchInput.toLowerCase()) != -1){
				//spaceObj[spaceData[i].id] = spaceData[i];
				$('.userSpaceContainerLeft').empty();
		    	$('.userSpaceContainerRight').empty();
				(function(i){
					populateData(i)
						   
				}).call(spaceData[i],spaceData[i].id)
			}
		}
	})

})


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

$("div").on("click",".delMultipleSpaces",function(e){
	debugger
	e.stopPropagation();
	spacesToDel=[]
	$(this).removeClass('delMultipleSpaces').addClass('delMultiSpacesText')
	$('.headerSection').prepend('<input type="checkbox" class="multiDelCheckbox">')

	$('.delMultiSpacesText').text("Click to delete")
})

$("div").on("click",".multiDelCheckbox",function(e){
	debugger
	e.stopPropagation();
	var spaceId =  $(this).siblings(".spaceTitle").attr("data-spaceid")
	if(!isNaN(spaceId)){
		spacesToDel.push(parseInt(spaceId))
	}

})

$("div").on("click",".statDiv",function(){
	debugger
	console.log(visits)
	var diffSpaceTypes= ["welcome","private","featured"]
	var seriesMembers = {
							seriesName:"Space Members"
						}
	var seriesVisitors = {
							seriesName:"Space Visitors"
						 }
	var diffSpacesMembers={},
		spaceMembersCount = [],
		spaceVisitors=[],
		diffSpacesVisitors={},
		diffSpaceMembersArray=[], 
		diffSpacesVisitorsArray=[],
		maxVisitorsStat={
			maxVisitors:0,
			maxVisitsSpaceId:null
		}
		maxMembersStat={
			maxMembers:0,
			maxMembersSpaceId:null
		}
	for(var i=0;i<diffSpaceTypes.length;i++){
		diffSpacesMembers[diffSpaceTypes[i]] = 0
		diffSpacesVisitors[diffSpaceTypes[i]] = 0
	}
	
	Data.Space.getAll().then(function(allSpaceData){
		debugger
		for(var i=0;i<allSpaceData.length;i++){
			var totalSpaceMembers = ((allSpaceData[i].members == null)? 0: allSpaceData[i].members.length)
			
			if(allSpaceData[i].visitors > maxVisitorsStat.maxVisitors){
				maxVisitorsStat.maxVisitors = allSpaceData[i].visitors
				maxVisitorsStat.maxVisitsSpaceId = allSpaceData[i].id
			}
			spaceMembersCount.push({name: "Space ID: "+allSpaceData[i].id,y:totalSpaceMembers})
			spaceVisitors.push({name:"Space ID: "+allSpaceData[i].id,y:allSpaceData[i].visitors})
			if(allSpaceData[i].welcome){
			 diffSpacesMembers["welcome"] += totalSpaceMembers
			 diffSpacesVisitors["welcome"] += allSpaceData[i].visitors
			}
			else if(allSpaceData[i].private){
			 diffSpacesMembers["private"] += totalSpaceMembers
			 diffSpacesVisitors["private"] += allSpaceData[i].visitors
			}
			else if(allSpaceData[i].featured){
			 diffSpacesMembers["featured"] += totalSpaceMembers
			 diffSpacesVisitors["featured"]+= allSpaceData[i].visitors
			}

				
		}
		for(var i=0;i<diffSpaceTypes.length;i++){
			diffSpaceMembersArray.push({name:diffSpaceTypes[i],y:diffSpacesMembers[diffSpaceTypes[i]]})
			diffSpacesVisitorsArray.push({name:diffSpaceTypes[i],y:diffSpacesVisitors[diffSpaceTypes[i]]})
		}
		$.ajax({
			    url: "html/stats.html",
			    success: function (statsContent) { 
			    	debugger
			    	$("body").html(statsContent)
			    	$(".chartDiv").height($(window).height() - 120)
			    	if(maxVisitorsStat.maxVisitors >0){
				    	$(".trendingDiv").html("<sup>**</sup>Trending Space "+maxVisitorsStat.maxVisitsSpaceId+" with "+maxVisitorsStat.maxVisitors +" visitors")
				    	
				    }
			    	loadCharts("diffSpaceVisitors",diffSpacesVisitorsArray,seriesVisitors,"#visitors across spaces")
			    	loadCharts("diffSpaceMembers",diffSpaceMembersArray,seriesMembers,"#members across spaces")
			    	loadCharts("spaceVisitors",spaceVisitors,seriesVisitors,"#visitors per space")
			    	loadCharts("spaceMembers",spaceMembersCount,seriesMembers,"#members per space")
			    	bindEvents()
			    },
			    dataType: 'html'
			});

	})
})



$("div").on("click",".delMultiSpacesText",function(e){
	debugger
	e.stopPropagation();
	for(var i=0;i<spacesToDel.length;i++){
		visits[spacesToDel[i]]++;
		(function(i){
		Data.Space.deleteById(spacesToDel[i]).then(function (res){
			debugger
			if(i == spacesToDel.length-1){
				$('.userSpaceContainerLeft').empty()
		    	$('.userSpaceContainerRight').empty()
				loadSpaces()
			}
		})
	}).call(spacesToDel[i],i)

	}
})

/* Edit Space Information*/
$("div").on( "click", ".editSpace", function(e) {
	e.stopPropagation();
	var spaceDivId = parseInt($(this).closest(".userSpace").find(".spaceTitle").attr("data-spaceid"))
	
	Data.Space.getById(spaceDivId).then(function(spaceDetails){
		debugger
		var editSpaceDetails = spaceDetails
		editSpaceDetails.visitors = ++visits[spaceDivId];
		var membersArray = spaceDetails.members
		Data.Space.updateById(spaceDivId,editSpaceDetails).then(function(spaceVisitorsEdited){
			debugger
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
	    "featured":false,
	    "visitors":0
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
		    "featured":$('#featured').prop('checked'),
		    "visitors":visits[spaceId]
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
 	$(this).closest('.spcMembers_drpDwn').remove()
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