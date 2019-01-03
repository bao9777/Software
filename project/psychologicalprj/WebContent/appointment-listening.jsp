<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<% String path = request.getContextPath(); %>
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>倾听预约</title>
    <!-- zui -->
    <link href="css/zui-theme.css" rel="stylesheet">
    <link href="css/zui.css" rel="stylesheet">
    <link href="css/mystyle.css" rel="stylesheet">
    <script src="js/jquery-3.3.1.js"></script>
    <script src="js/zui.js"></script> 
    <script src="js/zui.lite.js"></script>
  </head>
  <body>
<%--   	teacher: ${teacher } --%>
    <!-- 在此处编码你的创意 -->
     <%@include file="head.jsp" %>
    <div class="panel contains">
        <div class="panel-body business-panel">
            <div class="business-diagram"></div>
            <div class="panel consulter-info">
              <div class="panel-body">
                <img src="<%=path %>/images/${teacher.user.userHeadPath}" />
                <a href="#">${teacher.user.userRealName }</a><br/>
                <!--咨询师资质-->
                <span class="tag">
	                <c:set var="var1" value="${authenticationAptitudeName }"/>
                        <c:forEach  var="tdv" items="${fn:split(var1,' ')}" begin="0" end="1">
                             <span class="qualification">${tdv }</span>
                        </c:forEach>
                </span><br/>
                <!--咨询方向-->
                <c:forEach items="${goodats }" var="goodat" varStatus="s">
	            	<span class="label label-primary">${goodat }</span>
                </c:forEach>
<!--                 <span class="label label-primary">婚姻家庭</span> -->
              </div>
            </div>
            <!--支付金额-->
            <div class="panel pay-info">
              <div class="panel-body">
                <span>收取</span><span class="tag-stress">押金</span><br/>
                <span class="money">￥20</span>
              </div>
            </div>
                  <form action="<%=path %>/insertorder" method="POST">
                  <input type="hidden" value="${teacher.teacherId }" name="teacherId"/>
                <input type="hidden" value="20" name="teacherPrice">
                <input type="hidden" value="${format }" name="date"/>
                <input type="hidden" value="8:00-9:00" name="content"/>
                 <input type="hidden" value="listenning" name="type"/>
            <div class="panel info-panel">
                <div class="panel-body">
                    <span class="board-title-h1">小贴士</span>
                    <p>您将获得一对一的及时倾听服务，本项服务<span class="stress">将按时计费</span><a href="#" class="tag">（计费标准）</a>，我们需要<span class="stress">预先收取一部分费用作为押金</span>，并在服务结束后结算余款。</p>
                    <p>我们的倾听师马上就到，请耐心等候哦。</p>
                      <!-- <p>记得按时来参加咨询哦。</p> -->
                      <div class="protocal">
                        <input type="checkbox" value="protocal1" name="protocal" id="pro1"/>已阅读并同意上文所述&nbsp;
                        <input type="checkbox" value="protocal1" name="protocal" id="pro2"/>已阅读并同意《相关协议》
                      </div>
                    </div>
                  </div>
                      <button class="btn btn-block" disabled="disabled" id="confirmed-btn">确认并前往支付<i class="icon icon-smile"></i></button>
                </form>
                 <script>
              $("input").click( function(){
                if( ($("#pro1").is(":checked") && $("#pro2").is(":checked"))){
                      $("#confirmed-btn").removeAttr("disabled");
                    }
                else{
                	$("#confirmed-btn").attr("disabled","disabled");
                }
              })
            </script>
        	</div>
    </div>
    <!-- jQuery (ZUI中的Javascript组件依赖于jQuery) -->
    <script src="js/jquery-1.11.0.min.js"></script>
    <!-- ZUI Javascript组件 -->
    <script src="js/zui.min.js"></script>
  </body>
</html>
