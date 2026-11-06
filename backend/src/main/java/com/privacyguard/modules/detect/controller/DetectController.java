package com.privacyguard.modules.detect.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.ocr.entity.ImageAnalysisRecord;
import com.privacyguard.modules.ocr.repository.ImageAnalysisRecordRepository;
import com.privacyguard.modules.scan.entity.LinkScanRecord;
import com.privacyguard.modules.scan.repository.LinkScanRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 主动识别控制器
 * 处理图片识别提交、链接扫描提交、二维码扫描提交和结果查询
 */
@RestController
@RequestMapping("/detect")
@RequiredArgsConstructor
public class DetectController {

    private final ImageAnalysisRecordRepository imageAnalysisRecordRepository;
    private final LinkScanRecordRepository linkScanRecordRepository;

    // TODO: 从鉴权上下文获取用户ID
    private final Long CURRENT_USER_ID = 1L;

    /** 提交图片识别任务 */
    @PostMapping("/image")
    public R<ImageAnalysisRecord> submitImage() {
        ImageAnalysisRecord record = new ImageAnalysisRecord();
        record.setUserId(CURRENT_USER_ID);
        record.setStatus((short) 3); // 模拟已完成
        record.setSensitiveTags("[\"身份证号\",\"手机号\",\"家庭住址\"]");
        record.setRiskLevel("high");
        record.setExplanation("检测到图片中包含身份证号码、手机号和家庭住址等敏感个人信息，存在隐私泄露风险。");
        record.setSuggestion("1. 立即删除该图片的分享记录\n2. 检查是否在社交平台发布过该图片\n3. 使用打码工具处理敏感区域后再分享");
        imageAnalysisRecordRepository.save(record);
        return R.ok(record);
    }

    /** 提交链接扫描任务 */
    @PostMapping("/link")
    public R<LinkScanRecord> submitLink(@RequestBody(required = false) java.util.Map<String, String> body) {
        String url = body != null ? body.getOrDefault("url", "未知链接") : "未知链接";
        LinkScanRecord record = new LinkScanRecord();
        record.setUserId(CURRENT_USER_ID);
        record.setScanType("link");
        record.setInputContent(url);
        record.setStatus((short) 3);
        record.setRiskLevel("medium");
        record.setResultSummary("该链接域名注册时间较短，且使用了多级重定向跳转，存在中等风险。");
        record.setRiskReason("1. 域名注册时间不足30天\n2. 检测到2级以上重定向\n3. SSL证书为免费证书");
        record.setSuggestion("1. 不要在该链接页面输入任何个人信息\n2. 如需访问，使用浏览器的隐私模式\n3. 核实链接来源的可信度");
        linkScanRecordRepository.save(record);
        return R.ok(record);
    }

    /** 提交二维码扫描任务 */
    @PostMapping("/qrcode")
    public R<LinkScanRecord> submitQrcode(@RequestBody(required = false) java.util.Map<String, String> body) {
        String content = body != null ? body.getOrDefault("content", "二维码内容") : "二维码内容";
        LinkScanRecord record = new LinkScanRecord();
        record.setUserId(CURRENT_USER_ID);
        record.setScanType("qrcode");
        record.setInputContent(content);
        record.setStatus((short) 3);
        record.setRiskLevel("safe");
        record.setResultSummary("该二维码解析后指向正规网站，未发现明显异常。");
        record.setSuggestion("该二维码经分析安全可靠，但仍请注意：\n1. 不要随意扫描来路不明的二维码\n2. 公共场所的二维码可能被替换");
        linkScanRecordRepository.save(record);
        return R.ok(record);
    }

    /** 查询识别结果 */
    @GetMapping("/result/{id}")
    public R<Object> getResult(@PathVariable Long id, @RequestParam(defaultValue = "image") String type) {
        if ("image".equals(type)) {
            return R.ok(imageAnalysisRecordRepository.findById(id).orElse(null));
        } else {
            return R.ok(linkScanRecordRepository.findById(id).orElse(null));
        }
    }
}
