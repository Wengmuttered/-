package com.privacyguard.modules.auth.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.auth.dto.LoginResponse;
import com.privacyguard.modules.auth.dto.WxLoginRequest;
import com.privacyguard.modules.auth.service.WechatAuthService;
import com.privacyguard.modules.system.entity.AdminAccount;
import com.privacyguard.modules.system.repository.AdminAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

/**
 * 身份认证控制器
 * 提供微信登录、后台登录和游客初始化功能
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final WechatAuthService wechatAuthService;
    private final AdminAccountRepository adminAccountRepository;

    /** 微信授权登录 */
    @PostMapping("/wechat-login")
    public R<LoginResponse> wechatLogin(@RequestBody WxLoginRequest request) {
        LoginResponse sessionData = wechatAuthService.wechatLogin(request);
        return R.ok(sessionData);
    }

    /** 后台账号登录 */
    @PostMapping("/admin-login")
    public R<Map<String, Object>> adminLogin(@RequestBody Map<String, String> body) {
        String loginName = body.get("account");
        String password = body.get("password");

        if (loginName == null || password == null) {
            return R.fail("账号或密码不能为空");
        }

        Optional<AdminAccount> accountOpt = adminAccountRepository.findByLoginName(loginName);

        // 如果系统中没有任何管理员账号，自动创建一个默认账号
        if (accountOpt.isEmpty()) {
            long count = adminAccountRepository.count();
            if (count == 0 && "admin".equals(loginName) && "admin123".equals(password)) {
                AdminAccount defaultAdmin = new AdminAccount();
                defaultAdmin.setLoginName("admin");
                defaultAdmin.setPasswordHash("admin123"); // 一期简化，未使用BCrypt
                defaultAdmin.setRealName("系统管理员");
                defaultAdmin.setStatus((short) 1);
                defaultAdmin.setLastLoginAt(LocalDateTime.now());
                adminAccountRepository.save(defaultAdmin);

                return R.ok(Map.of(
                    "token", "PG-TOKEN-" + System.currentTimeMillis(),
                    "accountId", defaultAdmin.getId(),
                    "realName", defaultAdmin.getRealName()
                ));
            }
            return R.fail("账号不存在");
        }

        AdminAccount account = accountOpt.get();
        // 一期简化校验
        if (!account.getPasswordHash().equals(password)) {
            return R.fail("密码错误");
        }

        if (account.getStatus() != 1) {
            return R.fail("账号已被禁用");
        }

        account.setLastLoginAt(LocalDateTime.now());
        adminAccountRepository.save(account);

        return R.ok(Map.of(
            "token", "PG-TOKEN-" + System.currentTimeMillis(),
            "accountId", account.getId(),
            "realName", account.getRealName() != null ? account.getRealName() : account.getLoginName()
        ));
    }

    /** 游客体验初始化 */
    @GetMapping("/guest-init")
    public R<Map<String, Object>> guestInit() {
        return R.ok(Map.of(
            "guestId", "GUEST-" + System.currentTimeMillis(),
            "allowedModules", new String[]{"interpret", "knowledge"},
            "expiresIn", 1800
        ));
    }

    /**
     * 手机号绑定 — 接收微信 getPhoneNumber 回调的 code，换取真实手机号并绑定到当前用户
     * 微信小程序端通过 button open-type="getPhoneNumber" 触发
     */
    @PostMapping("/phone-bind")
    public R<Map<String, Object>> phoneBind(@RequestBody Map<String, String> body) {
        String phoneCode = body.get("code");
        Long userId = body.get("userId") != null ? Long.parseLong(body.get("userId")) : 1L;

        if (phoneCode == null || phoneCode.isEmpty()) {
            return R.fail("手机号授权码不能为空");
        }

        /*
         * 正式环境流程：
         * 1. 使用 phoneCode 调用微信 phonenumber.getPhoneNumber 接口获取真实手机号
         * 2. 接口地址: POST https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=ACCESS_TOKEN
         * 3. 请求体: { "code": phoneCode }
         * 4. 返回: { "phone_info": { "phoneNumber": "186xxxx1234", "purePhoneNumber": "186xxxx1234" }}
         *
         * 一期开发阶段，由于本地环境无法调用微信开放平台，这里模拟绑定操作
         */
        String simulatedPhone = "138****" + (System.currentTimeMillis() % 10000);

        // 通过 userId 查找用户并更新手机号
        var userOpt = wechatAuthService.getUserById(userId);
        if (userOpt != null) {
            // 实际绑定逻辑已在 WechatAuthService 中预留
        }

        return R.ok(Map.of(
            "bound", true,
            "phone", simulatedPhone,
            "userId", userId
        ));
    }

    /**
     * Token 刷新 — 客户端在 Token 即将过期时调用，获取新 Token
     */
    @PostMapping("/refresh")
    public R<Map<String, Object>> refreshToken(@RequestBody Map<String, String> body) {
        String oldToken = body.get("token");
        if (oldToken == null || oldToken.isEmpty()) {
            return R.fail("Token 不能为空");
        }
        // 一期简化：直接颁发新 Token（正式应做 JWT 签名验证+续期）
        String newToken = "PG-TOKEN-" + System.currentTimeMillis();
        return R.ok(Map.of(
            "token", newToken,
            "expiresIn", 7200
        ));
    }

    /**
     * 退出登录 — 清除服务端会话状态
     */
    @PostMapping("/logout")
    public R<Map<String, Object>> logout(@RequestBody Map<String, String> body) {
        // 一期简化：服务端无状态，仅返回成功标识；客户端负责清除本地存储
        // 正式应将 Token 加入黑名单或清除 Redis 缓存
        return R.ok(Map.of("loggedOut", true));
    }
}
