package com.psychologicalcounseling.login.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.entity.Teacher;
import com.entity.User;
import com.listenning.service.ConsultationRecordServiceImpl;
import com.listenning.service.ListenRecordServiceImpl;
import com.listenning.service.TeacherServiceImpl;
import com.listenning.service.UserServiceImpl;
import com.psychologicalcounseling.login.dao.IsNewPhoneDaoImpl;
import com.psychologicalcounseling.login.service.AddPhoneByUserIdServiceImpl;
import com.psychologicalcounseling.login.service.RegistServiceImpl;
import com.psychologicalcounseling.login.service.VerifyPwdServiceImpl;

/**
 * 
 * @desc:此控制器控制登录注册的所有功能
 * @author 刘田会
 * @date:2018年11月22日下午9:19:36
 */

@Controller
@RequestMapping("/login")
public class LoginController {

	private static final long serialVersionUID = 1L;

	@Resource
	private UserServiceImpl userServiceImpl;

	@Resource
	private ConsultationRecordServiceImpl consultationRecordServiceImpl;

	@Resource
	private ListenRecordServiceImpl listenRecordServiceImpl;

	@Resource
	private TeacherServiceImpl teacherServiceImpl;
	@Resource
	private IsNewPhoneDaoImpl isps;
	@Resource
	private RegistServiceImpl rsl;
	@Resource
	private VerifyPwdServiceImpl vpsi;
	@Resource
	private AddPhoneByUserIdServiceImpl apbaisi;
	private Logger logger = Logger.getLogger(LoginController.class);

	/**
	 * 
	 * @desc:根据手机号码判断是否为新用户
	 * @param phoneNum
	 * @return false-新用户 true-老用户
	 * @return:String
	 * @trhows
	 */

	@RequestMapping("/isNewPhone")
	@ResponseBody
	public String isNewphone(@RequestParam(value = "phoneNum", required = false) String phoneNum) {

		logger.info(phoneNum + "**********");
		if (isps.isNewPhoneDaoImpl(phoneNum)) {
			return "{\"result\":\"true\"}";
		} else {
			return "{\"result\":\"false\"}";
		}
	}

	/**
	 * 
	 * @desc:用户注册/快速登录 如果新用户插数据库之后跳转到redirect页，老用户直接跳redirect页。
	 * @param phoneNum
	 * @return
	 * @return:String
	 * @throws IOException
	 * @throws ServletException
	 * @trhows
	 */
	@RequestMapping("/regist")
	public void regist(@RequestParam(value = "phoneNum", required = false) String phoneNum, HttpSession session,
			HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		JSONObject json = new JSONObject(this.isNewphone(phoneNum));
		logger.info(json.getString("result"));
		// 如果是新用户的情况下，进行插入数据库操作。
		if (json.getString("result").equals("false")) {
			// result为影响的条数
			int result = rsl.regist(phoneNum);
			int userId = rsl.getUserId(phoneNum);
			session.setAttribute("userId", userId);
		}
		req.getRequestDispatcher("/login/redirect").forward(req, resp);
	}

	/**
	 * ----------------------------------分界线-------------------------------------------下面是登录
	 * 
	 * @desc: 在用账号密码方式登录时，检查密码是否正确
	 * @param phoneNum
	 *            根据手机号，判断密码
	 * @return
	 * @return:String same--密码正确 | different--密码错误
	 * @trhows
	 */
	@RequestMapping("/verifyPwd")
	@ResponseBody
	public String verifyPwd(@RequestParam(value = "phoneNum", required = false) String phoneNum,
			@RequestParam(value = "pwd", required = false) String pwd) {

		if (phoneNum == null || phoneNum.equals("")) {
			return "{\"result\":\"pleaseGetPhone\"}";

		} else {
			if (vpsi.verifyPwd(phoneNum, pwd)) {
				return "{\"result\":\"same\"}";
			} else {
				return "{\"result\":\"different\"}";
			}
		}
	}

	/**
	 * 
	 * @desc:账号密码的方式登录
	 * @param session
	 * @param phoneNum
	 * @param req
	 * @param resp
	 * @throws ServletException
	 * @throws IOException
	 * @return:void
	 * @trhows
	 */
	@RequestMapping("/login4Pwd")
	public void login4Pwd(HttpSession session, @RequestParam(value = "phoneNum", required = false) String phoneNum,
			HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		int userId = rsl.getUserId(phoneNum);
		session.setAttribute("userId", userId);

		User user = userServiceImpl.getUserById(userId);
		logger.info("用户id：" + userId);
		logger.info("用户：" + user);

		// session 中放入自己的对象
		session.setAttribute("user", user);
		int id = user.getUserId();
		int identity = user.getUserIdentity();

		if (identity == 3 || identity == 2) {
			// 如果是倾听师 || 咨询师，将其teacher表中的 canListen 改为 1
			Teacher t = teacherServiceImpl.findTeacherById(id);
			teacherServiceImpl.changeTeacherCanListen(t, 1);
			logger.info("登录后将canListen改为1");
		}

		req.getRequestDispatcher("/login/redirect").forward(req, resp);
	}

	/**
	 * 
	 * @desc:用来完善用户的手机号。
	 * @param phoneNum
	 *            要完善的手机号
	 * @param 根据这个Id，来更新手机号
	 * @return:void
	 * @trhows
	 */
	@RequestMapping("/addPhone")
	@ResponseBody
	public void addPhone(@RequestParam(value = "phoneNum", required = false) String phoneNum, HttpSession session) {
		apbaisi.addPhone(phoneNum, session.getAttribute("userId").toString());
	}

	/**
	 * 
	 * @desc:进行登录后的重定向检查,判断登陆完成之后，将跳到哪个页面。
	 * @param session
	 * @param req
	 * @param resp
	 * @throws ServletException
	 * @throws IOException
	 * @return:void
	 * @trhows
	 */
	@RequestMapping(value = "/redirect")
	public void directAfterLogin1(HttpSession session, HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String backToUrl = (String) session.getAttribute("backToUrl");
		if (backToUrl != null) {
			req.getRequestDispatcher(backToUrl).forward(req, resp);
		} else {
			req.getRequestDispatcher("/index.jsp").forward(req, resp);
		}
	}

	@RequestMapping("/LoginServlet")
	public String deal(HttpServletRequest request, HttpServletResponse response) throws IOException {

		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset = UTF-8");

		HttpSession session = request.getSession();
		logger.info("LoginServlet sesssion: " + session);
		if (session.getAttribute("userId") == null) {
			response.getWriter()
					.write("<script>alert('请您先完成登录！'); window.location='login.jsp' ;window.close();</script>");
			response.getWriter().flush();
			return "login";
		}
		int userId = (int) session.getAttribute("userId");
		User user = userServiceImpl.getUserById(userId);
		logger.info("用户id：" + userId);
		logger.info("用户：" + user);

		// session 中放入自己的对象
		session.setAttribute("user", user);
		int id = user.getUserId();
		int identity = user.getUserIdentity();

		if (identity == 3 || identity == 2) {
			// 如果是倾听师 || 咨询师，将其teacher表中的 canListen 改为 1
			Teacher t = teacherServiceImpl.findTeacherById(id);
			teacherServiceImpl.changeTeacherCanListen(t, 1);
			logger.info("登录后将canListen改为1");
		}

		return "index";
	}

}
