package com.privacyguard.modules.notification.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.notification.entity.MessageNotification;
import com.privacyguard.modules.notification.repository.MessageNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 消息中心控制器
 * 提供站内消息的查询、详情和已读标记功能
 */
@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageNotificationRepository messageNotificationRepository;

    // TODO: 从鉴权上下文获取用户ID，一期硬编码模拟
    private final Long CURRENT_USER_ID = 1L;

    /** 获取消息列表 */
    @GetMapping("/list")
    public R<List<MessageNotification>> listMessages() {
        return R.ok(messageNotificationRepository.findByUserIdOrderByCreatedAtDesc(CURRENT_USER_ID));
    }

    /** 获取消息详情 */
    @GetMapping("/detail/{id}")
    public R<MessageNotification> getMessageDetail(@PathVariable Long id) {
        return R.ok(messageNotificationRepository.findById(id).orElse(null));
    }

    /** 标记为已读 */
    @PostMapping("/read/{id}")
    public R<Void> markAsRead(@PathVariable Long id) {
        MessageNotification msg = messageNotificationRepository.findById(id).orElse(null);
        if (msg != null) {
            msg.setIsRead(true);
            messageNotificationRepository.save(msg);
        }
        return R.ok(null);
    }
}
