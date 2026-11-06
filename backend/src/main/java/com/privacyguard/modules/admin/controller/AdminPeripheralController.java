package com.privacyguard.modules.admin.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.interpret.entity.InterpretTemplate;
import com.privacyguard.modules.interpret.repository.InterpretTemplateRepository;
import com.privacyguard.modules.notification.entity.MessageTemplate;
import com.privacyguard.modules.notification.entity.SystemAnnouncement;
import com.privacyguard.modules.notification.repository.MessageTemplateRepository;
import com.privacyguard.modules.notification.repository.SystemAnnouncementRepository;
import com.privacyguard.modules.system.entity.*;
import com.privacyguard.modules.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 后台综合管理控制器
 * 提供知识库、模板、任务、账号、角色、日志、公告、消息模板的 CRUD 操作
 */
@RestController
@RequestMapping("/admin/peripheral")
@RequiredArgsConstructor
public class AdminPeripheralController {

    private final KnowledgeArticleRepository knowledgeArticleRepository;
    private final InterpretTemplateRepository interpretTemplateRepository;
    private final AsyncTaskRecordRepository asyncTaskRecordRepository;
    private final AdminAccountRepository adminAccountRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final AuditLogRepository auditLogRepository;
    private final SystemAnnouncementRepository systemAnnouncementRepository;
    private final MessageTemplateRepository messageTemplateRepository;

    // ==================== 知识中心 ====================

    /** 获取知识库列表 */
    @GetMapping("/knowledge")
    public R<List<KnowledgeArticle>> getKnowledgeList() {
        return R.ok(knowledgeArticleRepository.findAll());
    }

    /** 新增/编辑知识文章 */
    @PostMapping("/knowledge")
    public R<KnowledgeArticle> saveKnowledge(@RequestBody KnowledgeArticle article) {
        return R.ok(knowledgeArticleRepository.save(article));
    }

    /** 获取知识详情 */
    @GetMapping("/knowledge/{id}")
    public R<KnowledgeArticle> getKnowledge(@PathVariable Long id) {
        return R.ok(knowledgeArticleRepository.findById(id).orElse(null));
    }

    // ==================== 模板中心 ====================

    /** 获取解读模板列表 */
    @GetMapping("/templates")
    public R<List<InterpretTemplate>> getTemplatesList() {
        return R.ok(interpretTemplateRepository.findAll());
    }

    /** 新增/编辑解读模板 */
    @PostMapping("/templates")
    public R<InterpretTemplate> saveTemplate(@RequestBody InterpretTemplate template) {
        return R.ok(interpretTemplateRepository.save(template));
    }

    /** 获取模板详情 */
    @GetMapping("/templates/{id}")
    public R<InterpretTemplate> getTemplate(@PathVariable Long id) {
        return R.ok(interpretTemplateRepository.findById(id).orElse(null));
    }

    // ==================== 任务监控 ====================

    /** 获取 OCR 任务列表 */
    @GetMapping("/ocr-tasks")
    public R<List<AsyncTaskRecord>> getOcrTasksList() {
        return R.ok(asyncTaskRecordRepository.findByTaskTypeOrderByCreatedAtDesc("ocr"));
    }

    /** 获取解读任务列表 */
    @GetMapping("/interpret-tasks")
    public R<List<AsyncTaskRecord>> getInterpretTasksList() {
        return R.ok(asyncTaskRecordRepository.findByTaskTypeOrderByCreatedAtDesc("interpret"));
    }

    /** 获取扫描任务列表 */
    @GetMapping("/scan-tasks")
    public R<List<AsyncTaskRecord>> getScanTasksList() {
        return R.ok(asyncTaskRecordRepository.findByTaskTypeOrderByCreatedAtDesc("scan"));
    }

    /** 重试失败任务 */
    @PostMapping("/tasks/{id}/retry")
    public R<AsyncTaskRecord> retryTask(@PathVariable Long id) {
        AsyncTaskRecord task = asyncTaskRecordRepository.findById(id).orElse(null);
        if (task != null && task.getStatus() == 4) {
            task.setStatus((short) 1);
            task.setRetryCount(task.getRetryCount() + 1);
            task.setFailReason(null);
            asyncTaskRecordRepository.save(task);
        }
        return R.ok(task);
    }

    // ==================== 后台账号管理 ====================

    /** 获取后台账号列表 */
    @GetMapping("/accounts")
    public R<List<AdminAccount>> getAccountsList() {
        return R.ok(adminAccountRepository.findAll());
    }

    /** 新增/编辑后台账号 */
    @PostMapping("/accounts")
    public R<AdminAccount> saveAccount(@RequestBody AdminAccount account) {
        return R.ok(adminAccountRepository.save(account));
    }

    // ==================== 角色权限管理 ====================

    /** 获取角色列表 */
    @GetMapping("/roles")
    public R<List<AdminRole>> getRolesList() {
        return R.ok(adminRoleRepository.findAll());
    }

    /** 新增/编辑角色 */
    @PostMapping("/roles")
    public R<AdminRole> saveRole(@RequestBody AdminRole role) {
        return R.ok(adminRoleRepository.save(role));
    }

    // ==================== 审计日志 ====================

    /** 获取审计日志列表（最近100条） */
    @GetMapping("/logs")
    public R<List<AuditLog>> getLogsList() {
        return R.ok(auditLogRepository.findTop100ByOrderByCreatedAtDesc());
    }

    // ==================== 公告管理 ====================

    /** 获取公告列表 */
    @GetMapping("/announcements")
    public R<List<SystemAnnouncement>> getAnnouncementsList() {
        return R.ok(systemAnnouncementRepository.findAll());
    }

    /** 新增/编辑公告 */
    @PostMapping("/announcements")
    public R<SystemAnnouncement> saveAnnouncement(@RequestBody SystemAnnouncement announcement) {
        return R.ok(systemAnnouncementRepository.save(announcement));
    }

    // ==================== 消息模板管理 ====================

    /** 获取消息模板列表 */
    @GetMapping("/msg-templates")
    public R<List<MessageTemplate>> getMsgTemplatesList() {
        return R.ok(messageTemplateRepository.findAll());
    }

    /** 新增/编辑消息模板 */
    @PostMapping("/msg-templates")
    public R<MessageTemplate> saveMsgTemplate(@RequestBody MessageTemplate template) {
        return R.ok(messageTemplateRepository.save(template));
    }
}
