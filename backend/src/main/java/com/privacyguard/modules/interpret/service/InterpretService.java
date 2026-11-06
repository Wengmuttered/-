package com.privacyguard.modules.interpret.service;

import com.privacyguard.modules.interpret.dto.InterpretDtoGroup;
import com.privacyguard.modules.interpret.entity.InterpretTask;
import com.privacyguard.modules.interpret.repository.InterpretTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InterpretService {

    private final InterpretTaskRepository taskRepository;

    /**
     * 发起分析破译，建立分析单据返回端点编号以供追踪
     */
    public Long submitTask(Long userId, InterpretDtoGroup.SubmitRequest req) {
        InterpretTask task = new InterpretTask();
        task.setUserId(userId);
        task.setTaskType(req.getTaskType());
        task.setContent(req.getContent());
        task.setStatus("PROCESSING");
        task = taskRepository.save(task);

        // TODO 替换为大模型 API
        analyzeTaskAsync(task.getId(), req.getTaskType());

        return task.getId();
    }

    private void analyzeTaskAsync(Long taskId, String type) {
        new Thread(() -> {
            try {
                Thread.sleep(2500); // 虚拟 AI 分析运算过程挂起

                Optional<InterpretTask> tOpt = taskRepository.findById(taskId);
                if (tOpt.isPresent()) {
                    InterpretTask t = tOpt.get();
                    t.setStatus("COMPLETED");

                    // 构造出伪造结论
                    if ("LINK".equalsIgnoreCase(type)) {
                        t.setRiskLevel("high");
                        t.setResultSummary("这是一个常见的刷单点赞型诈骗链接。拦截器识别到了同源攻击服务器特征。");
                        t.setAdvice("切勿打开此链接！立刻斩断内网交互并删除包含该链接的聊天。");
                    } else if ("TEXT".equalsIgnoreCase(type)) {
                        t.setRiskLevel("medium");
                        t.setResultSummary("该协议强行截取了位置权限，属于霸王索取行为。");
                        t.setAdvice("若非必须请拒绝该权限，或者使用系统的'隐匿模式'假装授权。");
                    } else if ("IMAGE".equalsIgnoreCase(type)) {
                        t.setRiskLevel("high");
                        t.setResultSummary("图像云分析识别出身份证号码轮廓与暴露的家庭信件地址。");
                        t.setAdvice("打码处理，不可通过社交平台原图发送！");
                    } else {
                        t.setRiskLevel("safe");
                        t.setResultSummary("目标探测完毕：静态状态表现正常。");
                        t.setAdvice("处于安全状态。");
                    }
                    taskRepository.save(t);
                    log.info("AI_INTERPRET_FINISHED: TaskId={}", taskId);
                }
            } catch (Exception e) {
                log.error("AI_ENGINE_CORE_CRASH", e);
            }
        }).start();
    }

    public InterpretDtoGroup.ResultResponse getResult(Long taskId) {
        InterpretTask t = taskRepository.findById(taskId).orElse(null);
        if (t == null) return null;

        return InterpretDtoGroup.ResultResponse.builder()
                .taskId(t.getId())
                .status(t.getStatus())
                .taskType(t.getTaskType())
                .riskLevel(t.getRiskLevel())
                .resultSummary(t.getResultSummary())
                .advice(t.getAdvice())
                .build();
    }
}
