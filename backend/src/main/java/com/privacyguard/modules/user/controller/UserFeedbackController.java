package com.privacyguard.modules.user.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.admin.entity.FeedbackTicket;
import com.privacyguard.modules.admin.repository.FeedbackTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 专供前端特工作战客户端上传反馈意见用的发射端。
 */
@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class UserFeedbackController {

    private final FeedbackTicketRepository feedbackTicketRepository;
    private final Long CURRENT_USER = 1L;

    @PostMapping("/submit")
    public R<Void> submitFeedback(@RequestBody FeedbackTicket ticket) {
        ticket.setReporterId("AGT-" + CURRENT_USER);
        ticket.setStatus("UNRESOLVED");
        feedbackTicketRepository.save(ticket);
        return R.ok(null);
    }
}
