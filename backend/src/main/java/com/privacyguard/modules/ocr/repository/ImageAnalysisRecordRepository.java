package com.privacyguard.modules.ocr.repository;

import com.privacyguard.modules.ocr.entity.ImageAnalysisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 图片分析记录数据访问层
 */
@Repository
public interface ImageAnalysisRecordRepository extends JpaRepository<ImageAnalysisRecord, Long> {

    /** 按用户ID查询分析记录 */
    List<ImageAnalysisRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
}
