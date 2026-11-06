package com.privacyguard.modules.asset.controller;

import com.privacyguard.common.result.R;
import com.privacyguard.modules.asset.entity.AssetAccount;
import com.privacyguard.modules.asset.repository.AssetAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 账号安全清单与外部泄露风险总指挥部
 */
@RestController
@RequestMapping("/asset")
@RequiredArgsConstructor
public class AssetAccountController {

    private final AssetAccountRepository assetAccountRepository;
    private final Long CURRENT_USER = 1L;

    /** 账号清单查询 */
    @GetMapping("/list")
    public R<List<AssetAccount>> listAssets() {
        return R.ok(assetAccountRepository.findAllByUserId(CURRENT_USER));
    }

    /** 资产条目新增或保存 */
    @PostMapping("/save")
    public R<AssetAccount> saveAsset(@RequestBody AssetAccount account) {
        account.setUserId(CURRENT_USER);
        // 这里理论上要通过一套弱密码拦截解析系统对明文或模式进行判断。目前模拟直插。
        if (account.getRiskLevel() == null) {
            account.setRiskLevel("SAFE");
        }
        return R.ok(assetAccountRepository.save(account));
    }

    /** 弱密/重密码汇总分析下发入口 */
    @GetMapping("/risk-overview")
    public R<Map<String, Object>> getRiskOverview() {
        List<AssetAccount> all = assetAccountRepository.findAllByUserId(CURRENT_USER);
        long weakCount = all.stream().filter(a -> "WEAK".equals(a.getRiskLevel())).count();
        long dupeCount = all.stream().filter(a -> "REUSED".equals(a.getRiskLevel())).count();
        long leakCount = all.stream().filter(a -> "LEAKED".equals(a.getRiskLevel())).count();
        return R.ok(Map.of(
                "weakPasswordCount", weakCount,
                "reusedPasswordCount", dupeCount,
                "leakRiskStatus", leakCount > 0 ? "DETECTED" : (weakCount + dupeCount > 0 ? "WARNING" : "SAFE")
        ));
    }

    /**
     * 弱密码提醒入口 — 返回当前用户账号清单中密码强度标记为 WEAK 的条目
     */
    @GetMapping("/weak-password-check")
    public R<Map<String, Object>> weakPasswordCheck() {
        List<AssetAccount> all = assetAccountRepository.findAllByUserId(CURRENT_USER);
        List<AssetAccount> weakList = all.stream()
                .filter(a -> "WEAK".equals(a.getRiskLevel()))
                .collect(java.util.stream.Collectors.toList());
        return R.ok(Map.of(
                "totalCount", all.size(),
                "weakCount", weakList.size(),
                "weakAccounts", weakList,
                "suggestion", weakList.isEmpty() ? "密码强度合格，无需调整" : "建议升级以下账号的密码强度"
        ));
    }

    /**
     * 重复密码提醒入口 — 返回当前用户账号清单中密码标记为 REUSED 的条目
     */
    @GetMapping("/duplicate-password-check")
    public R<Map<String, Object>> duplicatePasswordCheck() {
        List<AssetAccount> all = assetAccountRepository.findAllByUserId(CURRENT_USER);
        List<AssetAccount> dupeList = all.stream()
                .filter(a -> "REUSED".equals(a.getRiskLevel()))
                .collect(java.util.stream.Collectors.toList());
        return R.ok(Map.of(
                "totalCount", all.size(),
                "duplicateCount", dupeList.size(),
                "duplicateAccounts", dupeList,
                "suggestion", dupeList.isEmpty() ? "无重复密码风险" : "建议为以下账号设置不同密码"
        ));
    }
}

