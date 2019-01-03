package com.courseing.lesson.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.courseing.lesson.dao.LessonDaoImp;
import com.entity.Course;
import com.entity.CourseCatalog;
import com.entity.Evaluate;
import com.entity.TypeTable;
import com.entity.User;
import com.util.Page;

@Service
@Transactional(readOnly = true)
public class LessonServiceImp {
	@Resource
	private LessonDaoImp lessondaoimpl;

	/* course-list页 */

	/**
	 * 展示course-list top四个课程
	 * 
	 * @return
	 */
	public List<Course> showFreeLesson() {
		List<Course> course = this.lessondaoimpl.selectFreeLesson();
		return course;

	}

	/**
	 * 展示course-list top四个课程
	 * 
	 * @return
	 */
	public List<Course> showTopLesson() {
		List<Course> course = this.lessondaoimpl.selectTopLesson();
		return course;

	}

	/**
	 * 展示Course-list 课程类型的展示
	 * 
	 * @return
	 */
	public Set<TypeTable> showLessonType() {
		Set<TypeTable> type = this.lessondaoimpl.selectLessonStyle();
		return type;
	}

	/**
	 * 展示Course-list end分类排序的分页课程
	 * 
	 * @return
	 */
	public Page showEndLesson(int style, int order, int pageNum, int pageSize) {
		Page page = new Page(pageNum, pageSize);
		page = (this.lessondaoimpl.selectEndLesson(style, order, pageNum, pageSize));
		return page;

	}

	/**
	 * 展示course-list,course-instr,course的课程评论分页数量
	 * 
	 * @param page
	 * @return
	 */
	public List<Integer> showLessonPage(Page page) {
		List<Integer> count = new ArrayList<Integer>();
		int num = (int) page.getTotalPageNum();
		for (Integer i = 1; i <= num; i++) {
			count.add(i);
		}
		return count;
	}

	/**
	 * 展示course-instr 课程的介绍
	 * 
	 * @return
	 */
	public Course showInstroduceLesson(int courseId) {
		return this.lessondaoimpl.selectDescription(courseId);

	}

	/**
	 * 展示course-instr 和course 课程的目录
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<CourseCatalog> showContentLesson(int courseId) throws Exception {
		List<CourseCatalog> list = this.lessondaoimpl.selectContent(courseId);
		return list;

	}

	/**
	 * 展示course-instr 和 course 展示评论Service
	 * 
	 * @param courseId
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	public Page showComment(int courseId, int pageNum, int pageSize) {
		Page page = new Page(pageNum, pageSize);
		page = this.lessondaoimpl.selectLessonComment(courseId, pageNum, pageSize);
		return page;
	}

	/**
	 * 展示course-instr 和 course加入评论Service
	 * 
	 * @param comment
	 * @return
	 */
	@Transactional(readOnly = false)
	public boolean loginComment(Evaluate comment) {
		return this.lessondaoimpl.insertLessonComment(comment);
	}

	/**
	 * 展示course-instr 课程的相关老师课程
	 * 
	 * @return
	 */
	public List<Course> showAboutTeacherLesson(int courseId) {
		return this.lessondaoimpl.selectAboutLesson(courseId);

	}

	/**
	 * 展示course 课程的相关类型课程
	 * 
	 * @return
	 */
	public List<Course> showAboutTypeLesson(int courseId) {
		return this.lessondaoimpl.selectAboutTypeLesson(courseId);

	}

	public User showUser(int userId) {
		return this.lessondaoimpl.selectUser(userId);
	}

}
