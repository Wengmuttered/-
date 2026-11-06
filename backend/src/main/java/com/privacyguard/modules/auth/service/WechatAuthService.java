package com.privacyguard.modules.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.privacyguard.common.exception.BusinessException;
import com.privacyguard.common.utils.JwtUtil;
import com.privacyguard.modules.auth.dto.LoginResponse;
import com.privacyguard.modules.auth.dto.WxLoginRequest;
import com.privacyguard.modules.user.entity.UserAccount;
import com.privacyguard.modules.user.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

/**
 * 微信安全身份鉴权总线
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WechatAuthService {

    private final UserAccountRepository userRepository;
    private final JwtUtil jwtUtil;
    
    // 这里使用 SpringBoot 默认带来的 RestTemplate 对微信服务器发起请求
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${wechat.miniapp.appid}")
    private String appid;

    @Value("${wechat.miniapp.secret}")
    private String secret;

    @Transactional
    public LoginResponse wechatLogin(WxLoginRequest request) {
        String jsCode = request.getCode();
        if (jsCode == null || jsCode.isEmpty()) {
            throw new BusinessException(400, "INVALID_JS_CODE_PROVIDED");
        }

        // 1. 发起与腾讯深网的 HTTP 通信，去中心化调取物理 openid
        String url = String.format("https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appid, secret, jsCode);
        
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            
            // 查验腾讯服务器的反馈报文
            if (rootNode.has("errcode") && rootNode.get("errcode").asInt() != 0) {
                 log.error("WECHAT_API_REJECTED: {}", rootNode.toString());
                 throw new BusinessException(500, "WECHAT_AUTHORIZATION_FAILED: " + rootNode.get("errmsg").asText());
            }

            String openid = rootNode.get("openid").asText();
            
            // 2. 将腾讯体系内的 OpenID 连接到本地的 PostgreSQL 的实体装配厂
            boolean isNewUser = false;
            UserAccount account = userRepository.findByOpenid(openid).orElse(null);
            
            if (account == null) {
                // 如果是全新设备截获，静默建档
                account = new UserAccount();
                account.setOpenid(openid);
                account.setSource("wechat");
                account.setStatus((short) 1);
                account.setLastLoginAt(LocalDateTime.now());
                account = userRepository.save(account);
                isNewUser = true;
                log.info("NEW_ENTITY_REGISTERED: {}", account.getId());
            } else {
                // 对于老访客，刷新驻留时间
                account.setLastLoginAt(LocalDateTime.now());
                account = userRepository.save(account);
                log.info("EXISTING_ENTITY_LOGGED_IN: {}", account.getId());
            }
            
            // 3. 利用特工私钥签发 JWT Token 颁发访问特权
            String token = jwtUtil.generateToken(account.getOpenid(), account.getId());
            
            return new LoginResponse(token, account.getId(), isNewUser);

        } catch (BusinessException be) {
             throw be;
        } catch (Exception e) {
             log.error("SYSTEM_EXCEPTION_DURING_AUTH", e);
             throw new BusinessException(500, "SYSTEM_EXCEPTION_DURING_AUTH");
        }
    }
    /**
     * 根据用户ID查找用户实体（供手机号绑定等场景使用）
     */
    public UserAccount getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * 更新用户手机号（供手机号绑定使用）
     */
    @Transactional
    public UserAccount bindPhone(Long userId, String phone) {
        UserAccount account = userRepository.findById(userId).orElse(null);
        if (account != null) {
            account.setPhone(phone);
            return userRepository.save(account);
        }
        return null;
    }
}
