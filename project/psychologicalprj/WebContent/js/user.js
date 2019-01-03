//----------------------刘田会--------------------------
//用于实名验证界面的“保存”按钮上。
//功能：判断按钮由disabled变亮的条件。
function isLegal(){
	var idName=$('input[name="idName"]').val();
    var idNum=$('input[name="idNum"]').val();
	var pass4IdNum=IdentityCodeValid(idNum);
	var pass4Name=checkRealName(idName);
	
	if(pass4IdNum==false){
		$("#errorMsg4IdNum").text("身份证号码不合法");
		$("#errorMsg4IdNum").attr("class","msg-err");
	}else{
		$("#errorMsg4IdNum").text("");
		$("#errorMsg4IdNum").attr("class","msg-right");
	}
	if(pass4Name==false){
		$("#errorMsg4Name").text("姓名不合法");
		$("#errorMsg4Name").attr("class","msg-err");
	}else{
		//既然没有调用实名接口，就不要显示“姓名合法”字眼了。
		$("#errorMsg4Name").text("");
		$("#errorMsg4Name").attr("class","msg-right");
	}
	
	if($("#errorMsg4IdNum").attr("class")=="msg-right"&&$("#errorMsg4Name").attr("class")=="msg-right"){
		$("#realName").removeAttr("disabled");
	}else{
		$("#realName").attr("disabled","disabled");
	}
}
//为了防止用户输入非法信息，比如script标签。
function stripscript(s) {
	return s.replace(/<[^<>]+>/g, ''); 

} 
//修改在个人基本信息界面
//功能：1.实现“修改”和“保存”界面的跳转。2.通过ajax来进行数据库更新。3.通过ajax返回的用户的姓名，省份等信息，赋值到界面上。使其在保存过后立刻就能在界面上显示新保存的信息。
function changeBtnValue(obj){
    console.log($(obj).html());
    if($(obj).html()=="修改"){
        $(obj).html("保存");
        $(obj).siblings("table:last").css("display","block");
        $(obj).siblings("table:first").css("display","none");
        //显示省和市下拉框的内容，并且设置默认值。
        showProvinceAndCity();
        
        //在更改实名信息的条件下
        if($(obj).attr("id")=="realName"){
	      //让“保存”按钮变灰。如果信息填正确，下面有方法让“保存”按钮变红。
			$("#realName").attr("disabled","disabled");
        }
        //设置单选框的默认值。
        console.log($("#hiddenUserSex").attr("class"));
        if($("#hiddenUserSex").attr("class")=="男"){
        	$("#female").removeAttr('checked');
        	$("#male").attr("checked","checked");
        	console.log($("#male").attr('checked'));
        }else if($("#hiddenUserSex").attr("class")=="女"){
        	$("#male").removeAttr('checked');
        	$("#female").attr('checked','checked');
        }
    }else{
    	//区分button是修改基本信息还是修改实名信息。
    	//essentialInfo--基本信息 realName--实名信息
    	console.log($(obj).attr("id"));
    	if($(obj).attr("id")=="essentialInfo"){
	        var nicoName1=$('input[name="nicoName"]').val();
	   
	        var nicoName=stripscript(nicoName1);
	        console.log(nicoName+"456456545646546545645646546");
	        var gender=$('input[name="gender"]:checked').val();
	        var province=$('select[name="province"]').val();
	        var city=$('select[name="city"]').val();
	        var userAutograph1=$('input[name="userAutograph"]').val();
	        var userAutograph=stripscript(userAutograph1);
	        //ajax---修改基本信息
	        var controllerName = "user/reviseEssentialInfo";
	    	var toUrl = window.location.protocol+controllerName;
	        $.ajax({
	    		url:toUrl,
	    		async:false,
	    		type:"post",
	    		dataType:"json",
	    		charset:"utf-8",
	    		data:{"nicoName":nicoName,"gender":gender,"province":province,"city":city,"userAutograph":userAutograph},
	    		success:function(data){
	    			$("#select-province").text(data.userProvince);
	    			$("#select-city").text(data.userCity);
	    			$("#send-phone-pwd").text(data.userPhone.substring(0,3)+"****"+data.userPhone.substring(7,11));
	    			$("#show-old-phone").text(data.userPhone.substring(0,3)+"****"+data.userPhone.substring(7,11));
	    			$(".user-name").text(data.userNickName);
	    			$("#user-autograph").text(data.userAutograph);
	    			$("#userNickName").text(data.userNickName);
	    			$("#userSex").text(data.userSex);
	    			$("#userProvince").text(data.userProvince+" "+data.userCity);
	    			$("#userAutograph").text(data.userAutograph);
	    		},
	    		error:function(XMLHttpRequest, textStatus, errorThrown){
	    			alert(XMLHttpRequest.status); 
	    	     	alert(XMLHttpRequest.readyState); 
	    			alert(textStatus); 
	    		}
	    	})
    	}else if($(obj).attr("id")=="realName"){	
    		var idName=$('input[name="idName"]').val();
	        var idNum=$('input[name="idNum"]').val();
    		//console.log("进去修改实名信息了");
	        var controllerName = "user/reviseRealName";
	    	var toUrl = window.location.protocol+controllerName;
    		 $.ajax({
 	    		url:toUrl,
 	    		async:false,
 	    		type:"post",
 	    		dataType:"json",
 	    		data:{"idName":idName,"idNum":idNum},
 	    		success:function(data){
 	    			$("#userRealName").text(data.userRealName);
 	    			$("#userIdNumber").text(data.userIdNumber.substring(0,6)+"*********"+data.userIdNumber.substring(14,18));
 	    		},
 	    		error:function(XMLHttpRequest, textStatus, errorThrown){
 	    			alert(XMLHttpRequest.status); 
 	    	     	alert(XMLHttpRequest.readyState); 
 	    			alert(textStatus); 
 	    		}
 	    	})
    	}
    	//**上面的两个ajax书写完毕，下面功能是切换“修改”和“保存”状态。
        $(obj).html("修改");
        $(obj).siblings("table:first").css("display","block");
        $(obj).siblings("table:last").css("display","none");
        $(obj).attr("type","button");
    } 
}

//在忘记密码的流程中，给手机发送验证码。
//注意事项：不复用之前的方法，原因是手机号码没办法直接获取，之前取手机号的方式与现在不同。
var sendTime = 60;
function sendCode4Pwd(){
	$("#resendMsg").css("display","none");
	$("#resendMsg").attr("onclick","");
    var phoneNum = $("#user-phoneNum-Pwd").attr("class");
    var controllerName = "login/getMessage";
	var toUrl = window.location.protocol+controllerName;
    $.ajax({
		url:toUrl,
		async:true,
		type:"post",
		dataType:"json",
		data:{"phoneNum":phoneNum},
		success:function(data){	
			
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status); 
	     	alert(XMLHttpRequest.readyState); 
			alert(textStatus); 
		}
	})
	self.setInterval(function(){
        var currentTime = new Date().getSeconds();
        var time = (currentTime - sendTime);
        if(time > 60){
            //document.getElementById('login-send-verifyCode').removeAttribute("disabled");
        	$("#resendMsg").css("display","block");
    		$("#resendMsg").attr("onclick","sendCode4Pwd();");
            window.clearInterval(int);
            sendTime = 60;
            return;
        }
    },1000);
}
//在忘记密码,发送验证码的界面
//功能：判断验证码的正确性
function PwdVerifyCode(obj){
	var code=$("#pwd-code").val();
	if(code.length > 6 || code.length < 6){ 
        $("#error-msg-code").text("验证码长度不正确");
        $("#error-msg-code").attr("class","msg-err");
      
    } else if(code.length==0){
    	 $("#error-msg-code").text("请输入验证码");
    	 $("#error-msg-code").attr("class","msg-err");
    
    }else{
       
    }
	var controllerName = "login/verifyCode";
	var toUrl = window.location.protocol+controllerName;
	$.ajax({
		url:toUrl,
		async:false,
		type:"post",																																																							
		dataType:"json",
		data:{"code":code},
		success:function(data){
			
			if(data.result=="different"){
				$("#error-msg-code").text("验证码不正确");
				$("#error-msg-code").attr("class","msg-err");
				
				$("#verify-code-pwd").attr("disabled","disabled");
			}else if(data.result=="outOfTime"){
				$("#error-msg-code").attr("class","msg-err");
				$("#error-msg-code").text("验证码超时");
				
				$("#verify-code-pwd").attr("disabled","disabled");
			}else if(data.result=="same"){
				$("#error-msg-code").attr("class","msg-right");
				$("#error-msg-code").text("验证码正确");
				
				$("#verify-code-pwd").removeAttr("disabled");
			}else{
				console.log("在修改密码界面，发送手机验证码出错");
				$("#verify-code-pwd").attr("disabled","disabled");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert(XMLHttpRequest.status); 
	     	alert(XMLHttpRequest.readyState); 
			alert(textStatus); 
			
		}
	})
}


//在以原密码为根据修改密码时
//判断原始密码是否正确
function verifyOldPwd(obj){
	
	var oldPwd=$('input[name="oldPwd"]').val();
	
	//更改请求url获取方式 by dy
	var controllerName = "user/verifyOldPwd";
	var toUrl = window.location.protocol+controllerName;
	//console.log("修改密码信息了（根据原密码）");
	
	 $.ajax({
 		url:toUrl,
 		async:false,
 		type:"post",
 		dataType:"json",
 		data:{"oldPwd":oldPwd},
 		success:function(data){
 			console.log(data.result);
 			if(data.result=="false"){
 				$("#errorMsg-oldPwd").text("原始密码错误");
 				$("#errorMsg-oldPwd").attr("class","msg-err");
 			
 			}else{
 				$("#errorMsg-oldPwd").text("原始密码正确");
 				$("#errorMsg-oldPwd").attr("class","msg-right");
 				
 			}
 		},
 		error:function(XMLHttpRequest, textStatus, errorThrown){
 			console.log("status="+XMLHttpRequest.status);
 			console.log("readyState="+XMLHttpRequest.readyState);
 			console.log("textStatus="+textStatus);
 			//alert(XMLHttpRequest.status); 
 	     	//alert(XMLHttpRequest.readyState); 
 			//alert(textStatus); 
 		}
 	})
 	isCanClick4Pwd();
}
//判断新密码位数是否合法
function checkNewPwd(obj){
	var newPwd=$('input[name="newPwd"]').val();
	if(newPwd.length>16||newPwd.length<6){
		$("#errorMsg-newPwd").text("密码位数须在6-16位之间");
		$("#errorMsg-newPwd").attr("class","msg-err");
	
	}else{
		$("#errorMsg-newPwd").text("密码合法");
		$("#errorMsg-newPwd").attr("class","msg-right");
		
	}
	isCanClick4Pwd();
}
//在“忘记密码”界面--同样不可以复用。
//功能：判断新密码位数是否合法--
function checkNewPwdWithPhone(obj){
	var newPwd=$('input[name="newPwdWithPhone"]').val();
	if(newPwd.length>16||newPwd.length<6){
		$("#errorMsg-newPwd-phone").text("密码位数须在6-16位之间");
		$("#errorMsg-newPwd-phone").attr("class","msg-err");
	
	}else{
		$("#errorMsg-newPwd-phone").text("密码合法");
		$("#errorMsg-newPwd-phone").attr("class","msg-right");
		
	}
	isCanClick4PwdWithPhone();
}
//输入新密码界面
//判断前后两次输入的密码是否一致
function confirm4Pwd(obj){
	var newPwd=$('input[name="newPwd"]').val();
	var confirmPwd=$('input[name="confirmPwd"]').val();
	if(newPwd==confirmPwd){
		$("#errorMsg-confirmPwd").text("密码相匹配");
		$("#errorMsg-confirmPwd").attr("class","msg-right");
		
	}else{
		$("#errorMsg-confirmPwd").text("两次密码不一致，请修改");
		$("#errorMsg-confirmPwd").attr("class","msg-err");
	
	}
	isCanClick4Pwd();
}
//在“忘记密码”界面--同样不可以复用。
//功能：判断两次新密码是否一致
function confirm4PwdWithPhone(obj){
	var newPwd=$('input[name="newPwdWithPhone"]').val();
	var confirmPwd=$('input[name="confirmPwdWithPhone"]').val();
	if(newPwd==confirmPwd){
		$("#errorMsg-confirmPwd-phone").text("密码相匹配");
		$("#errorMsg-confirmPwd-phone").attr("class","msg-right");
	}else{
		$("#errorMsg-confirmPwd-phone").text("两次密码不一致，请修改");
		$("#errorMsg-confirmPwd-phone").attr("class","msg-err");
		
	}
	isCanClick4PwdWithPhone();
}
//在以原密码作为依据修改密码界面，检测“修改”按钮
//功能：判断是否能够由disabled变红色
function isCanClick4Pwd(){
	//console.log($("#errorMsg-newPwd").attr("class"));
	if(($("#errorMsg-oldPwd").attr("class")=="msg-right" || $("#errorMsg-oldPwd").attr("class")=="sign-display")&&($("#errorMsg-confirmPwd").attr("class")=="msg-right")&&($("#errorMsg-newPwd").attr("class")=="msg-right")){
		$("#RevisePwdButton").removeAttr("disabled");
	}else{
		$("#RevisePwdButton").attr("disabled","disabled");
	}
}
//在利用手机号发送短信验证码之后，修改密码界面，点击“确认设置”按钮
//功能：判断是否能够由disabled变红色
function isCanClick4PwdWithPhone(){
	
	if(($("#errorMsg-confirmPwd-phone").attr("class")=="msg-right")&&($("#errorMsg-newPwd-phone").attr("class")=="msg-right")){
		$("#RevisePwdButtonWithPhone").removeAttr("disabled");
	}else{
		$("#RevisePwdButtonWithPhone").attr("disabled","disabled");
	}
}
//修改密码时，点击“修改”按钮进行的操作
function finalButton4Pwd(obj){
	//两种情况，如果在通过手机号修改密码界面name=newPwdWithPhone.如果根据原密码修改界面name=newPwd。
	if($(obj).attr("id")=="RevisePwdButtonWithPhone"){
		var newPwd=$('input[name="newPwdWithPhone"]').val();
	}else{
		var newPwd=$('input[name="newPwd"]').val();
	}
	
	//更改请求url获取方式 by dy
	var controllerName = "user/revisePwd";
	var toUrl = window.location.protocol+controllerName;
	$.ajax({
 		url:toUrl,
 		async:false,
 		type:"post",
 		dataType:"json",
 		data:{"newPwd":newPwd},
 		success:function(data){
 			
 		},
 		error:function(XMLHttpRequest, textStatus, errorThrown){
 			console.log("status="+XMLHttpRequest.status);
 			console.log("readyState="+XMLHttpRequest.readyState);
 			console.log("textStatus="+textStatus);
// 			alert(XMLHttpRequest.status); 
// 	     	alert(XMLHttpRequest.readyState); 
// 			alert(textStatus); 
 		}
 	})
 	//下面是在点击“修改”按钮之后上面的密码信息清空，原因可能对用户交互信息更好，点击”修改“后页面上会有所反应，不会停留原来的信息。
 	$('input[name="newPwd"]').val("");
	$('input[name="oldPwd"]').val("");
	$('input[name="confirmPwd"]').val("");
 	$("#errorMsg-confirmPwd").text("");
	$("#errorMsg-newPwd").text("");
	$("#errorMsg-oldPwd").text("");
// 	$("#successMsg4Pwd").text("密码修改修改成功");
 	new $.zui.Messager('密码修改成功', {
	    type: 'success' // 定义颜色主题
	}).show();
}
//下面是修改绑定手机号界面，
//功能：点击“保存设置”按钮后更改数据库信息
function savePhone(){
	
    var phoneNum=$("#phoneNum").val();
    //ajax---更新手机号
    
	//更改请求url获取方式 by dy
    var controllerName = "login/addPhone";
	var toUrl = window.location.protocol+controllerName;
    $.ajax({
		url:toUrl,
		async:false,
		type:"post",
		dataType:"json",
		data:{"phoneNum":phoneNum},
		success:function(data){
			//$("#successMsg-revise-phone").text("手机号修改成功");
			new $.zui.Messager('手机号修改成功', {
			    type: 'success' // 定义颜色主题
			}).show();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			console.log("status="+XMLHttpRequest.status);
 			console.log("readyState="+XMLHttpRequest.readyState);
 			console.log("textStatus="+textStatus);
//			alert(XMLHttpRequest.status); 
//	     	alert(XMLHttpRequest.readyState); 
//			alert(textStatus); 
		}
	})
}
//个人基本信息修改界面。
//功能：1.下拉框出现省和市的信息 2.设置默认值
function showProvinceAndCity(){
	var userProvince=$("#select-province").attr("class");
    var userCity=$("#select-city").attr("class");
    
    var pHtmlStr = '';
    for(var name in pc){
    	if(userProvince==name){
            pHtmlStr = pHtmlStr + '<option selected="true" value="'+name+'">'+name+'</option>';
        }else{
        	pHtmlStr = pHtmlStr + '<option  value="'+name+'">'+name+'</option>';
        }
    }
    $("#province").html(pHtmlStr);
    $("#province").change(function(){
        var pname = $("#province option:selected").text();
        var pHtmlStr = '';
        var cityList = pc[pname];
        for(var index in cityList){
        	if(userCity==cityList[index]){
        		pHtmlStr = pHtmlStr + '<option selected="true" value="'+cityList[index]+'">'+cityList[index]+'</option>';
        	}else{
        		pHtmlStr = pHtmlStr + '<option  value="'+cityList[index]+'">'+cityList[index]+'</option>';
        	}
            
        }
        $("#city").html(pHtmlStr);
    });
    $("#province").change();
}
//实名信息界面。
//验证身份证是否合法。
function IdentityCodeValid(code) { 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    //验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }
    
   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    
    return pass;
}
//实名信息界面
//验证名字是否合法，二到四个汉字
function checkRealName(val){
	 reg = /^[\u4E00-\u9FA5]{2,4}$/;
	 if(!reg.test(val)){
		 return false;
	 }else{
	 	return true;
	 }
}
//上传用户图像。
function uploadHeadPath(){
	var animateimg = $("#choose-file").val(); //获取上传的图片名 带//
    var imgarr=animateimg.split('\\'); //分割
    var myimg=imgarr[imgarr.length-1]; //去掉 // 获取图片名
    var extension = myimg.lastIndexOf('.'); //获取 . 出现的位置 
    var ext = myimg.substring(extension, myimg.length).toUpperCase();
	var file = $('#choose-file').get(0).files[0]; //获取上传的文件
	
	if(file==null){
    	$("#error-msg-uploadfile").text("请先选择图片文件");
    	return false;
	}
	
    var fileSize = file.size;           //获取上传的文件大小
    var maxSize = 1048576*3;              //最大3MB
    
	if(ext !='.PNG' && ext !='.GIF' && ext !='.JPG' && ext !='.JPEG' && ext !='.BMP'){
        $("#error-msg-uploadfile").text("文件类型错误，请上传图片类型");
        return false;
    }else if(parseInt(fileSize) >= parseInt(maxSize)){
    	$("#error-msg-uploadfile").text("上传文件不能超过3MB");        
    	return false;
    }else{
	    	var controllerName = "userHeadUpload";
	    	var toUrl = window.location.protocol+controllerName;
	    	var formdata=new FormData();
            formdata.append("file",$("#choose-file").get(0).files[0]);
            formdata.append("ext",ext);
            //获取全局变量的路径
            var ctx=$("#get-ctx").attr("class");
            console.log(ctx);
			$.ajax({
				url:toUrl,
				type:"post",
				dataType:"json",
				processData: false,  
	            contentType: false ,
	            async:false,
				data:formdata,
				success:function(data){
					if(data.result=="false"){
				        $("#error-msg-uploadfile").text("头像上传失败，请重新上传");
					}else if(data.result=="success"){
						console.log(data.userHeadPath);
						$("#avatar").attr("src",ctx+data.userHeadPath);
						$("#img-user-center").attr("src",ctx+data.userHeadPath);
						$("#img-user-center-second").attr("src",ctx+data.userHeadPath);
						$("#error-msg-uploadfile").text("头像上传成功");
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(XMLHttpRequest.status); 
			     	alert(XMLHttpRequest.readyState); 
					alert(textStatus); 
				}
			})
    }
}
//----------------邓旸------------------
function findBackPwd(){
    $("#find-back-pwd").css("display","block");
    $("#shade").css("display","block");
    
}
function closeWindow(obj){
    $(obj).parent().css("display","none");
    $("#shade").css("display","none");
}
function setNewPwd(){
    $("#find-back-pwd").css("display","none");
    $("#set-new-pwd").css("display","block");
}