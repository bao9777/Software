package com.indexing.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entity.ConsultationRecord;
import com.indexing.dao.ConsultationRecordDaoImpl;

@Service
@Transactional
public class ConsultationRecordServiceImpl {

	@Resource
	private ConsultationRecordDaoImpl consultationRecordDaoImpl;

	public List<ConsultationRecord> listUnusedConsultationRecordsByUserId(int id) {

		return consultationRecordDaoImpl.findUnusedConsultationRecordsByUserId(id);

	}

	public List<ConsultationRecord> listAllUnusedConsultationRecords() {
		return consultationRecordDaoImpl.findAllUnusedConsultationRecords();
	}

	public List<ConsultationRecord> listUnusedConsultationRecordsByTeacherId(int id) {
		return consultationRecordDaoImpl.findUnusedConsultationRecordsByTeacherId(id);
	}
	
	public List<ConsultationRecord> listUnusedConsultationRecordsById(int id, int identity) {
		
		List<ConsultationRecord> consultationRecords;
		if(identity == 1) {
			consultationRecords = consultationRecordDaoImpl  
					.findUnusedConsultationRecordsByUserId(id);
		} else {
			consultationRecords = consultationRecordDaoImpl 
					.findUnusedConsultationRecordsByTeacherId(id);
		}
		return consultationRecords;
	}
	
	public void cancelConsultationById(int id) {
		
		consultationRecordDaoImpl.updateConsultationCancelById(id);
	}
	
	
	// 通过咨询订单Id 将其状态改为已咨询。
	public void changeConsultStateToDoneById(int consultationrecordId) {
		consultationRecordDaoImpl.updateConsultationrecordById(consultationrecordId);
	}
	
	public ConsultationRecord findConsultationRecordById(int id) {
		return consultationRecordDaoImpl.get(ConsultationRecord.class, id);
	}
	
	
	public Long countConsultationRecordByTeacherId(int id) throws Exception {
		return (Long) consultationRecordDaoImpl.countConsultationRecordByTeacherId(id);
	}
}
