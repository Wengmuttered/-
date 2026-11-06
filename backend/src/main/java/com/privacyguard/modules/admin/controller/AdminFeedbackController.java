package com.privacyguard.modules.admin.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.admin.entity.FeedbackTicket;
import com.privacyguard.modules.admin.repository.FeedbackTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 后台反馈管理控制器
 * 提供反馈列表查询、详情查询和状态更新
 */
@RestController
@RequestMapping("/admin/feedbacks")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final FeedbackTicketRepository feedbackTicketRepository;

    /** 获取反馈列表 */
    @GetMapping
    public R<List<FeedbackTicket>> listFeedbacks() {
        return R.ok(feedbackTicketRepository.findAll());
    }

    /** 获取反馈详情 */
    @GetMapping("/{id}")
    public R<FeedbackTicket> getFeedbackDetail(@PathVariable Long id) {
        return R.ok(feedbackTicketRepository.findById(id).orElse(null));
    }

    /** 更新反馈状态 */
    @PutMapping("/{id}/status")
    public R<FeedbackTicket> updateFeedbackStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        FeedbackTicket ticket = feedbackTicketRepository.findById(id).orElse(null);
        if (ticket != null) {
            String newStatus = body.get("status");
            if (newStatus != null) {
                ticket.setStatus(newStatus);
                feedbackTicketRepository.save(ticket);
            }
        }
        return R.ok(ticket);
    }
}
