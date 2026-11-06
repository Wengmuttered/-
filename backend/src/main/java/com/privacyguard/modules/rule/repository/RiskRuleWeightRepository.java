package com.privacyguard.modules.rule.repository;

import com.privacyguard.modules.rule.entity.RiskRuleWeight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 风险阈值与权重配置 Repository
 * 用于按维度类型查询和批量管理阈值配置
 */
@Repository
public interface RiskRuleWeightRepository extends JpaRepository<RiskRuleWeight, Long> {

    /** 根据维度类型查找配置 */
    Optional<RiskRuleWeight> findByDimensionType(String dimensionType);

    /** 查询指定规则的权重配置 */
    List<RiskRuleWeight> findByRuleId(Long ruleId);
}
