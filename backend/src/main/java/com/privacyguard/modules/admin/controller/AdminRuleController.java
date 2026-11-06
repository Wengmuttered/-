package com.privacyguard.modules.admin.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.admin.entity.SecurityRule;
import com.privacyguard.modules.admin.repository.SecurityRuleRepository;
import com.privacyguard.modules.rule.entity.RiskRuleWeight;
import com.privacyguard.modules.rule.repository.RiskRuleWeightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 后台规则管理控制器
 * 提供规则列表、新增、编辑、启停和阈值配置操作
 */
@RestController
@RequestMapping("/admin/rules")
@RequiredArgsConstructor
public class AdminRuleController {

    private final SecurityRuleRepository securityRuleRepository;
    private final RiskRuleWeightRepository riskRuleWeightRepository;

    /** 获取规则列表 */
    @GetMapping
    public R<List<SecurityRule>> listRules() {
        return R.ok(securityRuleRepository.findAll());
    }

    /** 新增规则 */
    @PostMapping
    public R<SecurityRule> addRule(@RequestBody SecurityRule rule) {
        return R.ok(securityRuleRepository.save(rule));
    }

    /** 获取规则详情 */
    @GetMapping("/{id}")
    public R<SecurityRule> getRuleDetail(@PathVariable Long id) {
        return R.ok(securityRuleRepository.findById(id).orElse(null));
    }

    /** 编辑规则 */
    @PutMapping("/{id}")
    public R<SecurityRule> updateRule(@PathVariable Long id, @RequestBody SecurityRule rule) {
        SecurityRule existing = securityRuleRepository.findById(id).orElse(null);
        if (existing != null) {
            if (rule.getTargetModule() != null) existing.setTargetModule(rule.getTargetModule());
            if (rule.getCondition() != null) existing.setCondition(rule.getCondition());
            if (rule.getAction() != null) existing.setAction(rule.getAction());
            if (rule.getStatus() != null) existing.setStatus(rule.getStatus());
            securityRuleRepository.save(existing);
        }
        return R.ok(existing);
    }

    /** 启停规则 */
    @PostMapping("/{id}/toggle")
    public R<SecurityRule> toggleRule(@PathVariable Long id) {
        SecurityRule existing = securityRuleRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setStatus("ACTIVE".equals(existing.getStatus()) ? "INACTIVE" : "ACTIVE");
            securityRuleRepository.save(existing);
        }
        return R.ok(existing);
    }

    /** 获取风险阈值配置列表 */
    @GetMapping("/threshold")
    public R<List<RiskRuleWeight>> listThresholds() {
        return R.ok(riskRuleWeightRepository.findAll());
    }

    /**
     * 更新风险阈值配置 — 按维度类型修改高/中/低阈值和权重
     */
    @PutMapping("/threshold")
    public R<RiskRuleWeight> updateThreshold(@RequestBody RiskRuleWeight incoming) {
        if (incoming.getDimensionType() == null) {
            return R.fail("维度类型不能为空");
        }
        RiskRuleWeight existing = riskRuleWeightRepository
                .findByDimensionType(incoming.getDimensionType())
                .orElse(null);
        if (existing == null) {
            // 如果不存在则创建
            return R.ok(riskRuleWeightRepository.save(incoming));
        }
        // 更新现有配置
        if (incoming.getWeight() != null) existing.setWeight(incoming.getWeight());
        if (incoming.getThresholdHigh() != null) existing.setThresholdHigh(incoming.getThresholdHigh());
        if (incoming.getThresholdMedium() != null) existing.setThresholdMedium(incoming.getThresholdMedium());
        if (incoming.getThresholdLow() != null) existing.setThresholdLow(incoming.getThresholdLow());
        return R.ok(riskRuleWeightRepository.save(existing));
    }
}

